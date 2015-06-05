import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
import Boom from 'boom';
import * as JwtService from '../../services/jwt';

const privateKey = JwtService.secret;

let validator = function(decodedToken, cb) {
  console.log("Attempting to validate user");
  // find the user based on decodedToken data
  let error;

  User
    .get(decodedToken.id)
    .run()
    .then((result) => {
      console.log("User validated: " + result.id);
      return cb(error, true, result);
    }, (err) => {
      error = err;
      return cb(Boom.unauthorized(err), false, {});
    });
}

let Plugin = {
  register: (server, options, next) => {

    server.auth.strategy('token', 'jwt', 'try', {
      key:            privateKey,
      validateFunc:   validator
    });

    next();
  }
};

Plugin.register.attributes = {
  pkg: require('./package.json')
};

export default Plugin;