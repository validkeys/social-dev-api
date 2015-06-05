import * as Setup from '../../../../setup';
import canShowUser from '../../../../../src/app/pods/users/policies/canShowUser';

// shortcuts
let lab     = Lab.script();

lab.experiment('Pods > Users > Policies > canShowUser', function() {

  lab.test('it exists', function(done) {
    expect(canShowUser).to.not.be.undefined;
    done();
  });

  lab.test('it should return true', function(done) {
    let req = {}, reply = {};
    canShowUser(req, reply, (res) => {
      expect(res).to.be.null;
      done();
    });
  });

});

export { lab };