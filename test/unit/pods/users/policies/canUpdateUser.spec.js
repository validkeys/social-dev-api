import * as Setup from '../../../../setup';
import canUpdateUser from '../../../../../src/app/pods/users/policies/canUpdateUser';

// shortcuts
let lab     = Lab.script();

lab.experiment('Pods > Users > Policies > canUpdateUser', function() {

  lab.test('it exists', function(done) {
    expect(canUpdateUser).to.not.be.undefined;
    done();
  });

  lab.test('I should be able to if the auth.credentials user is the req.data.user', (done) => {
    let request = {
      auth: {
        isAuthenticated: true,
        credentials: { id: 1}
      },
      data: {
        "User": { id: 1 }
      }
    };
    let reply   = function(){};
    canUpdateUser(request, reply, (res) => {
      expect(res).to.be.null;
      done();
    });
  });

  lab.test('I should get an error back if the loggedIn User is not the target user', (done) => {
    let request = {
      auth: {
        isAuthenticated: true,
        credentials: { id: 1}
      },
      data: {
        "User": { id: 2 }
      }
    };
    let reply = () => {};
    canUpdateUser(request, reply, (res, isValid, message) => {
      expect(isValid).to.be.false;
      expect(message).to.contain("may not update that user");
      done();
    });
  });
});

export { lab };