import * as Setup from '../../../../setup';
import canCreateUser from '../../../../../src/app/pods/users/policies/canCreateUser';

// shortcuts
let lab     = Lab.script();

lab.experiment('Pods > Users > Policies > canCreateUser', function() {

  lab.test('it exists', function(done) {
    expect(canCreateUser).to.not.be.undefined;
    done();
  });

  lab.test('if auth exist and isAuthenticated is not there, it should return', function(done) {
    let req = { auth: "" }, reply = {};
    canCreateUser(req, reply, (res) => {
      expect(res).to.be.null;
      done();
    });
  });

  lab.test('if auth exists and isAuthenticated is false, it should return', (done) => {
    let req = { auth: { isAuthenticated: false } }, reply = {};
    canCreateUser(req, reply, (res) => { 
      expect(res).to.be.null;
      done();
    });
  });

  lab.test('if isAuthenticated, should return an error', (done) => {
    let req = { auth: { isAuthenticated: true } }, reply = function(){};
    let spy = sinon.spy();
    canCreateUser(req, spy, (res) => {});
    expect(spy.called).to.be.true;
    let args = spy.args[0][0];
    expect(args.output.statusCode).to.equal(405);
    expect(args.isBoom).to.be.true;
    done();
  });

});

export { lab };