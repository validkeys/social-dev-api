import Lab from 'lab';
import Code from 'code';
import BaseSerializer from '../../../src/app/serializers/base';
import sinon from 'sinon';

var lab     = Lab.script(),
expect      = Code.expect,
beforeEach  = lab.beforeEach,
before      = lab.before,
after       = lab.after,
afterEach   = lab.afterEach;

lab.experiment('Base Serializer', function() {

  let sandbox;

  beforeEach(function(done) {
    sandbox = sinon.sandbox.create();
    done();
  });

  afterEach(function(done) {
    sandbox.restore();
    done();
  });

  lab.test('it should return my data', function(done) {
    let serializer = new BaseSerializer({ test: true });
    let result = serializer.serialize();
    expect("test" in result);
    expect(result.test).to.equal(true);
    done();
  });

  lab.test('it should have an isArray property', function(done) {
    var serializer = new BaseSerializer([{test: true}, {test: false}]);
    expect("isArray" in serializer).to.equal(true);
    expect(serializer.isArray).to.equal(true);
    done();
  });

  lab.test('when passed an object, isArray should be false', function(done) {
    let serializer = new BaseSerializer({test: true});
    expect(serializer.isArray).to.equal(false);
    done();
  });

  lab.test('when passed an object, the _serializeObject method should be called', function(done) {
    let serializer = new BaseSerializer({ test: true });
    let spy = sandbox.spy(serializer, "_serializeObject"),
        spy2 = sandbox.spy(serializer, "_serializeArray");
    serializer.serialize();
    expect(spy.calledOnce).to.equal(true);
    expect(spy2.called).to.equal(false);
    done();
  });

  lab.test('when passed an array, the _serializeArray method should be called', function(done) {
    let serializer = new BaseSerializer([{test: true}, {test: true}]);
    let objectSpy = sandbox.spy(serializer, "_serializeObject"),
        arraySpy = sandbox.spy(serializer, "_serializeArray");
    serializer.serialize();

    expect(objectSpy.calledTwice, 'calledTwice').to.equal(true);
    expect(arraySpy.calledOnce, 'calledOnce').to.equal(true);
    done();
  });

  lab.test('there should be an fields property that defaults to star', function(done) {
    let serializer = new BaseSerializer({test: true});
    expect("fields" in serializer).to.be.true();
    expect(serializer.fields).to.equal("*");
    done();
  });

  lab.test('when fields is a star, I should get my exact data back', function(done) {
    let serializer = new BaseSerializer({test: true});
    let result = serializer.serialize();
    expect(result).to.deep.equal({test: true});
    done();
  });

  lab.test('when fields is an object, serializeBySchema should be called', function(done) {
    let serializer = new BaseSerializer({hidden: true, visible: true});
    let spy = sandbox.spy(serializer, "_serializeBySchema");
    serializer.fields = ['visible'];
    let result = serializer.serialize();
    expect(spy.calledOnce, 'method should be called').to.be.true();
    expect("visible" in result, 'visible should be there').to.be.true();
    expect("hidden" in result, 'hidden should not be').to.be.false();
    done();
  });

  lab.test('when a field is not in the object, the serializer should call that method on itself', function(done) {
    let serializer = new BaseSerializer({test: true});
    serializer.fields = ['test','virtualField'];
    serializer.virtualField = function() {
      return "I am virtual!";
    }
    let spy = sinon.spy(serializer, 'virtualField');
    let result = serializer.serialize();
    expect(spy.calledOnce).to.be.true();
    expect("virtualField" in result).to.be.true();
    expect(result.virtualField).to.equal("I am virtual!");
    done();
  });

  lab.test('when a virtual field method is not found, it should not error out', function(done) {
    let serializer = new BaseSerializer({test: true});
    serializer.fields = ['test','virtualField'];
    let result = serializer.serialize();
    expect("virtualField" in result).to.be.false();
    done();
  });

});

export { lab };