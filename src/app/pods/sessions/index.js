import Controller from './controller';
import Joi from 'joi';

let register = (server, options, next) => {

  let root = "/sessions"

  server.route([
    {
      method:   "POST",
      path:     root + "/token",
      config:   {
        handler:      Controller.token,
        description:  "This is our login path. The user posts a username and password. We then validate and respond with the user_id and a JWT token",
        notes:        "Email and password are required here",
        validate:     {
          payload: {
            email:    Joi.string().email().required(),
            password: Joi.string().min(4).required()
          }
        }
      }
    }
  ]);

  next();
};

register.attributes = {
  pkg: require('./package.json')
};

export { register };