import {
  BaseFactory as Factory,
  startApp
} from '../setup';

import * as Helpers from '../support/helpers';
import moment from 'moment';
    
// shortcuts
var lab     = Lab.script(),
beforeEach  = lab.beforeEach,
before      = lab.before,
after       = lab.after,
afterEach   = lab.afterEach;

let server = null,
    user   = null,
    sandbox = null;

lab.experiment('Users', function() {

  before((done) => {
    sandbox = sinon.sandbox.create();
    startApp(function(err, res) {
      if (err) {
        console.log("Startup Error", err);
        process.exit(1);
      } else {
        console.log("Harness started successfully");
      }
      server = res.server;
      done();
    });
  });

  beforeEach(function( done ) {
    // create a new user
    Factory.create('user', function(err, newUser) {
      if (err) { console.log(err); }
      user = newUser;
      done();
    });
  });

  afterEach(function( done ) {
    sandbox.restore();
    server.plugins.db.r.table('users').delete().run().then(function() {
      user = null;
      done();
    })
    .catch(console.log);
  });

  // after(function(done) {
  //   stopServer(server, function() {
  //     console.log("SERVER STOPPED!");
  //     server = null;
  //     done();
  //   });
  // });


  lab.experiment('(GET) retrieving a user', function() {
    let response;

    lab.test('user get endpoint works', function(done) {
      let options = { method: "GET", url: "/users/" + user.id };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect("user" in response.result).to.be.ok;
        done();
      });
    });

    lab.test('the result should not include the user password', function(done) {
      let options = { method: "GET", url: "/users/" + user.id };
      server.inject(options, function(response) {
        expect(response.result.user.password).to.equal(undefined);
        done();
      });
    });

    lab.test('if the user is not found, it should return a 404', function(done) {
      let options = { method: "GET", url: "/users/123" }; 
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(404);
        done();
      });
    });

  });

  lab.experiment('(POST) creating a user', function() {

    let currentUser, currentUserHeaders;

    beforeEach((done) => {
      Factory.create('user', (err, user) => {
        if (err) console.log(err);
        currentUser         = user;
        currentUserHeaders  = Helpers.Auth.headers(currentUser);
        done();
      });
    });

    lab.test("I should be able to create a valid user", (done) => {
      Factory.build('user', (err, user) => {
        var options = { method: "POST", url: "/users", payload: {user: user} };
        server.inject(options, (response) => {
          expect(response.statusCode).to.equal(200);
          expect("user" in response.result).to.be.ok;
          expect("password" in response.result.user).to.be.false;
          done();
        });
      });
    });

    lab.test("I should get a 422 if email is invalid", (done) => {
      Factory.build('user', { email: "asdf" }, (err, user) => {
        var options = { method: "POST", url: "/users", payload: {user: user} };
        server.inject(options, (response) => {
          expect(response.statusCode).to.equal(422);
          expect(response.result.message).to.contain('Value for [email] must be a valid email.');
          done();
        });
      });
    });

    lab.test("I should get a 422 if email already exists", (done) => {
      Factory.build('user', { email: user.email }, (err, user) => {
        var options = { method: "POST", url: "/users", payload: {user: user} };
        server.inject(options, (response) => {
          expect(response.statusCode).to.equal(422);
          expect(response.result.message).to.contain('email is not unique in User');
          done();
        });
      });
    });

    lab.test("I should get a 422 if username is invalid", (done) => {
      Factory.build('user', { username: "---!" }, (err, user) => {
        var options = { method: "POST", url: "/users", payload: {user: user} };
        server.inject(options, (response) => {
          expect(response.statusCode).to.equal(422);
          expect(response.result.message).to.contain('Value for [username]');
          done();
        });
      });
    });

    lab.test("I should get a 422 if username already exists", (done) => {
      Factory.build('user', { username: user.username }, (err, user) => {
        var options = { method: "POST", url: "/users", payload: {user: user} };
        server.inject(options, (response) => {
          expect(response.statusCode).to.equal(422);
          expect(response.result.message).to.contain('username is not unique');
          done();
        });
      });
    });

    lab.test("I should get a 500 if I am already logged in (currentUser)", (done) => {

      Factory.build('user', (err, user) => {
        if (err) console.log(err);
        var options = { method: "POST", url: "/users", payload: {user: user}, headers: currentUserHeaders };
        server.inject(options, (response) => {
          expect(response.statusCode).to.equal(405);
          expect(response.result.message).to.contain("new user account as a logged in user");
          done();
        });
      });
    });


  });

  lab.experiment('(PUT) updating a user', () => {

    let currentUser, currentUserHeaders;

    beforeEach((done) => {
      Factory.create('user', (err, user) => {
        if (err) console.log(err);
        currentUser         = user;
        currentUserHeaders  = Helpers.Auth.headers(currentUser);
        done();
      });
    });

    lab.test('It should respond with a 401 if user not logged in', (done) => {
      let options = { method: "PUT", url: "/users/123" };
      server.inject(options, (res) => {
        expect(res.statusCode).to.equal(401);
        done();
      });
    });

    lab.test('It should allow a user through when authenticated', (done) => {
      let options = { method: "PUT", url: "/users/" + currentUser.id, headers: currentUserHeaders, payload: {user: {}} };
      server.inject(options, (res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    lab.test('It should return a 404 if user is not found', (done) => {
      let options = { method: "PUT", url: "/users/123321", headers: currentUserHeaders, payload: {user: {}} };
      server.inject(options, (res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
    
    lab.test('It should throw an error if user is trying to update another user', (done) => {
      Factory.create('user', (err, user) => {
        if (err) { console.log(err); }
        let options = { method: "PUT", url: "/users/" + user.id, headers: currentUserHeaders, payload: { user: {}} };
        server.inject(options, (res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.result.message.toLowerCase()).to.contain("you may not update that user");
          done();
        });
      });

    });

    lab.test('It should succeed if user is attempting to update themselves', (done) => {
      let options = {method: "PUT", url: "/users/" + currentUser.id, payload: {user: {firstName: "Tester1"}}, headers: currentUserHeaders};
      server.inject(options, (res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    lab.test('It should respond with the user model if successfully updated', (done) => {
      let options = {method: "PUT", url: "/users/" + currentUser.id, payload: {user: {firstName: "Tester1"}}, headers: currentUserHeaders};
      server.inject(options, (res) => {
        expect("user" in res.result).to.be.true;
        expect("id" in res.result.user).to.be.true;
        expect(res.result.user.id).to.equal(currentUser.id);
        expect(res.result.user.firstName).to.equal("Tester1");
        expect(res.result.user.lastName).to.equal(currentUser.lastName);
        expect(res.result.user.email).to.equal(currentUser.email);
        expect(res.result.user.username).to.equal(currentUser.username);
        done();
      });
    });

    lab.test('It should respond with the user model if not changes were made on the record', (done) => {
      let options = {method: "PUT", url: "/users/" + currentUser.id, payload: {user: currentUser}, headers: currentUserHeaders};
      server.inject(options, (res) => {
        expect(res.statusCode).to.equal(200);
        expect("user" in res.result).to.be.true;
        expect("password" in res.result).to.be.false;
        
        delete res.result.user.updatedAt;
        _.each(res.result.user, (value, key) => {
          if (currentUser[key]) {
            if (key == "createdAt") {
              let currentCreated = moment(currentUser["createdAt"]),
                  updatedCreated = moment(value);
              expect(currentCreated.diff(updatedCreated)).to.equal(0);
            } else {
              assert.equal(currentUser[key], value, `The ${key} is not the same`);
            }
          }
        });  

        done();
      });
    });

  });
  
  lab.experiment('(GET) listing users', () => {


    lab.test('I should get a 403 when requesting the users endpoint', function(done) {
      console.log("Running test");
      let options = { method: "GET", url: "/users" }; 
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(403);
        done();
      });
    });

    lab.test('If I pass an invalid username, i should get an error', function(done) {
      let options = { method: "GET", url: "/users?username=1" }; 
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    lab.test('If the username is valid, I should receive an array of 1', function(done) {
      let options = { method: "GET", url: "/users?username=" + user.username };
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(200);
        expect("users" in response.result);
        expect(response.result.users.length).to.equal(1);
        done();
      });
    });

  });

});

export { lab };