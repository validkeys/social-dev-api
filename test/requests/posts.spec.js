import {
  BaseFactory as Factory,
  startApp,
} from '../setup';

import * as Helpers from '../support/helpers';
import moment from 'moment';
import Promise from 'bluebird';
    
// shortcuts
let lab     = Lab.script(),
beforeEach  = lab.beforeEach,
before      = lab.before,
after       = lab.after,
afterEach   = lab.afterEach;

let server = null,
    user   = null,
    sandbox = null;

lab.experiment('Posts', function() {

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

  afterEach(function( done ) {
    sandbox.restore();
    Promise.all([
      server.plugins.db.r.table('posts').delete().run(),
      server.plugins.db.r.table('users').delete().run()
    ])
      .then(function() {
        user = null;
        done();
      })
      .catch(console.log);
  });

  lab.experiment('Creating posts', function(){

    let currentUser, currentUserHeaders;

    beforeEach((done) => {
      Factory.create('user', (err, user) => {
        if (err) console.log(err);
        currentUser         = user;
        currentUserHeaders  = Helpers.Auth.headers(currentUser);
        done();
      });
    });

    lab.test('The endpoint should exist', function(done) {
      let options = { method: "POST", url: "/posts" };
      server.inject(options, function(response) {
        expect(response.statusCode).to.not.equal(404);
        done();
      });
    });

    lab.test('I should have to be logged in', function(done) {
      let options = { method: "POST", url: "/posts" };
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(401);
        done();
      }); 
    });

    lab.test('payload should have to contain a post key', function(done) {
      let options = { method: "POST", url: "/posts", headers: currentUserHeaders };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(400);
        expect('error' in response.result).to.be.true;
        expect(response.result.message).to.contain("\"post\" is required");
        done();
      });
    });

    lab.test('I should be able to create a new post', function(done) {
      let options = { method: "POST", url: "/posts", headers: currentUserHeaders };
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(200);
        expect("post" in response.result);
        done();
      });
    });
    
  });

});

export { lab };