import * as JwtService from '../../../src/app/services/jwt';

let headers = function(user) {
  return {
    "Authorization": "Bearer " + JwtService.sign(user)
  };
};

export { headers };