import Controller from './controller';
import Joi from 'joi';
import * as PolicyService from '../../services/policies';

let index = (server, next) => {

  // Load Policies
  server.plugins.mrhorse.loadPolicies(server, {
    policyDirectory: require('path').join(__dirname, "/policies"),
    defaultApplyPoint: 'onPreHandler'
  } , function(err) {
        
    if (err) { 
      console.log("ERROR", err);
      return next(err);
    }

    let root = "/users";

    // Routes

    server.route([

      // INDEX ROUTE
      {
        method: "GET",
        path:   root,
        config: {
          handler: Controller.index,
          bind:    Controller,
          validate: {
            query: {
              username: Joi.string().alphanum().min(3).optional()
            }
          }
        }
      },

      // POST ROUTE

      {
        method:   "POST",
        path:     root,
        config:   {
          handler:      Controller.create,
          bind:         Controller,
          description:  "Create a new user.",
          notes:        "Must pass first, last, email and password",
          validate: {
            payload: {
              user: Joi.object().required()
            } 
          },
          plugins: {
            policies: PolicyService.withDefaults(server, ['canCreateUser'])
          }
        }
      },

      // GET ROUTE

      {
        method: "GET",
        path:   root + "/{user_id}",
        config: {
          handler:  Controller.show,
          bind:     Controller,
          plugins: {
            policies: PolicyService.withDefaults(server, ['canShowUser'])
          }
        }
      },

      // PUT ROUTE

      {
        method:   "PUT",
        path:     root + "/{user_id}",
        config:   {
          handler:  Controller.update,
          bind:     Controller,
          auth:   'token',
          validate: {
            payload: {
              user: Joi.object().required()
            } 
          },
          plugins: {
            policies: PolicyService.withDefaults(server, ['canUpdateUser', 'checkForPasswordChange'])
          }
        }
      }

      
    ]);

    next();
  });
}

let register = (server, options, next) => {
  server.after(index, 'mrhorse');
  next();
};

register.attributes = { pkg: require('./package') };

export { register };