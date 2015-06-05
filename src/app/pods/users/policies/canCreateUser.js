import Boom from 'boom';

let policy = (request, reply, next) => {
  if (request.auth && request.auth.isAuthenticated) {
    reply(Boom.methodNotAllowed('You may not create a new user account as a logged in user'));
  } else {
    next(null, true);
  }
};

export default policy;