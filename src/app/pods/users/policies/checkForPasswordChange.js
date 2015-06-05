import * as PasswordService from '../../../services/password';

let policy = function(request, reply, next) {

  console.log("Running checkForPasswordChange policy");

  if (!request.payload || !request.payload.password || !request.data.User) {
    console.log("There is no password in the payload");
    return next(null, true);
  }

  let password = request.payload.password;

  // check for password
  if (password) {
    if (!PasswordService.compare(password, request.data.User.password)) {
      request.payload.password = PasswordService.encrypt(request.payload.password);
    } else {
      // the password has not changed so don't update
      console.log("The password has not changed. Removing from the payload");
      delete request.payload.password;
    }
  }

  next(null, true);
}

export default policy;