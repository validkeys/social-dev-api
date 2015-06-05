import {
  BaseFactory as Factory,
  startDatabase,
  stopDatabase
} from '../../setup';

import { User } from '../../../src/app/models';
import moment from 'moment';
import * as PasswordService from '../../../src/app/services/password';

let lab     = Lab.script();

lab.experiment('user model', function() {

  let thinky, r;

  lab.before(function(done) {
    startDatabase((thinkyInstance) => {
      thinky = thinkyInstance;
      done();
    });
  });

  lab.after(function(done) {
    stopDatabase(done);
  });

  lab.test('I should be able to get a user', function(done) {
    let user;
    Factory.create('user', function(err, newUser) {
      if (err) { console.log(err, newUser); }
      user = newUser;
      expect(user).to.not.be.undefined;
      user.delete().then(function() {
        done();
      });
    });
  });

  lab.experiment('validation', function() {

    let validUser;

    lab.beforeEach(function(done) {
      Factory.create('user', (err, newUser) => {
        if (err) { console.log(err); }
        validUser = newUser;
        done();
      })
    });

    lab.afterEach(function(done) {
      validUser.delete().then(() => done());
    });


    lab.test('it should require a valid email address', function(done) {
      
      let promise = validUser.merge({ email: "asdf" }).save();
      promise.should.be.rejected;
      promise.should.be.rejectedWith(thinky.Errors.ValidationError);
      assert.isRejected(promise, /valid email/, "should be rejected with a valid email");
      done();

    });

    lab.test('firstName should be required', function(done) {
      Factory.build('user', (err, user) => {

        delete user.firstName;
        let exception,
            promise = user.save();

        promise.should.be.rejected;
        promise.should.be.rejectedWith(thinky.Errors.ValidationError);
        assert.isRejected(promise, /firstName/, 'should be rejected with a firstname required error').notify(done);
      });
    });

    lab.test('lastName should be required', function(done) {
      Factory.build('user', (err, user) => {

        delete user.lastName;
        let exception,
            promise = user.save();

        promise.should.be.rejected;
        promise.should.be.rejectedWith(thinky.Errors.ValidationError);
        assert.isRejected(promise, /[lastName]/, 'should be rejected with a lastName required error').notify(done);
      });
    });

    lab.test('username should be required', function(done) {
      Factory.build('user', (err, user) => {

        delete user.username;
        let exception,
            promise = user.save();

        promise.should.be.rejected;
        promise.should.be.rejectedWith(thinky.Errors.ValidationError);
        assert.isRejected(promise, /[username]/, 'should be rejected with a username required error').notify(done);
      });
    });

    lab.test('email should be required', function(done) {
      Factory.build('user', (err, user) => {

        delete user.email;
        let exception,
            promise = user.save();

        promise.should.be.rejected;
        promise.should.be.rejectedWith(thinky.Errors.ValidationError);
        assert.isRejected(promise, /[email]/, 'should be rejected with a email required error').notify(done);
      });
    });

    lab.test('password should be required', function(done) {
      Factory.build('user', (err, user) => {

        delete user.password;
        let exception,
            promise = user.save();

        promise.should.be.rejected;
        promise.should.be.rejectedWith(thinky.Errors.ValidationError);
        assert.isRejected(promise, /[password]/, 'should be rejected with a password required error').notify(done);
      });
    });
  });

  lab.experiment('hooks', function() {

    let validUser;

    lab.beforeEach(function(done) {
      Factory.create('user', (err, newUser) => {
        if (err) { console.log(err); }
        validUser = newUser;
        done();
      })
    });

    lab.afterEach(function(done) {
      validUser.delete().then(() => done());
    });

    lab.test('it should update the updatedAt field', function(done) {
      setTimeout(function() {
        let before = moment(validUser.updatedAt);
        validUser.merge({firstName: "boo"}).save()
          .then((updatedUser) => {
            let now = moment(updatedUser).utc();
            expect(now.diff(before)).to.not.equal(0);
            done();
          })
          .catch(function(e) {
            assert.fail();
          });
      }, 1);

    });

    lab.test('it should automatically encrypt the password', function(done) {
      Factory.build('user', function(err, user) {
        let currentPassword = user.password;

        user
          .save()
          .then(function(newUser) {
            expect(newUser.password).to.not.equal(currentPassword);
            expect(PasswordService.compare(currentPassword, newUser.password)).to.be.ok;
            user.delete().then(() => done());
          });
      });
    });

    lab.test('It should rehash the password if the password has changed');

  });

});

export { lab };