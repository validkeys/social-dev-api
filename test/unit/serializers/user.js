import Lab from 'lab';
import Code from 'code';
import UserSerializer from '../../../src/app/serializers/user';
import sinon from 'sinon';

var lab     = Lab.script(),
expect      = Code.expect,
beforeEach  = lab.beforeEach,
before      = lab.before,
after       = lab.after,
afterEach   = lab.afterEach;

lab.experiment('User Serializer', function() {

  let sandbox;

  beforeEach(function(done) {
    sandbox = sinon.sandbox.create();
    done();
  });

  afterEach(function(done) {
    sandbox.restore();
    done();
  });

  lab.test('returns the right fields', function(done) {
    let serializer = new UserSerializer({id: 1, firstName: "Kyle", lastName: "Davis", password: "HIDDEN"});
    let results = serializer.serialize();
    expect("id" in results).to.be.true();
    expect("firstName" in results).to.be.true();
    expect("lastName" in results).to.be.true();
    expect("password" in results).to.be.false();
    done();
  });

});

export { lab };