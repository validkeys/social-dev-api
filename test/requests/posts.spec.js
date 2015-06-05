import {
  BaseFactory as Factory,
  startApp,
} from '../setup';

import * as Helpers from '../support/helpers';
import moment from 'moment';
import Promise from 'bluebird';
    
// shortcuts
var lab     = Lab.script(),
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

    lab.test('The endpoint should exist', function(done) {
      var options = { method: "POST", url: "/posts" };
      server.inject(options, function(response) {
        expect(response.statusCode).to.not.equal(404);
        done();
      });
    });
    
  });

});

export { lab };