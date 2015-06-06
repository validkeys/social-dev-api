import Controller from './controller';
import Joi from 'joi';
import * as PolicyService from '../../services/policies';

let index = (server, next) => {

  let root = "/posts";

  server.route([

    // CREATE
    {
      method: "POST",
      path:   root,
      config: {
        handler: function(req, reply, next) {
          reply("HERE");
        },
        auth: 'token',
        validate: {
          payload: {
            post: Joi.object().required()
          }
        }
      }
    }

  ]);
  next();
};

let register = (server, options, next) => {
  server.after(index, 'mrhorse');
  next();
};

register.attributes = { pkg: require('./package') };

export { register };