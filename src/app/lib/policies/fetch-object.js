// This will attempt to fetch restful objects
// /users/{user_id} etc..
// it loops through each param in the url and
// attempts to fetch them
// it then attaches them to request.data[Model]
import _ from 'lodash';
import * as Models from '../../models';
import Promise from 'bluebird';
import Pluralize from 'pluralize';
import Boom from 'boom';

// var _           = require('lodash'),
//     Models      = global.reqlib('/src/app/models'),
//     Promise     = require('bluebird'),
//     Pluralize   = require('pluralize');

// Converts from user_id to User
// from user_story_id to UserStory
function camelize(str) {
  return str.split('_id')[0].replace('_',' ').replace(/(?:^|\s)\w/g, (match) => {
    return match.toUpperCase();
  }).replace(' ','');
}

let fetchObject = function(request, reply, next) {

  console.log("Running fetchObject policy");

  if (!request.params || request.params.length === 0 || ['GET','PUT','DELETE'].indexOf(request.method.toUpperCase()) === -1 ) {
    return next(null, true);
  }

  let promises = {};

  _.each(request.params, (value, key) => {
    let model = camelize(key),
        table = Models[model];

    if (table) {
      promises[model] = table.get(value).run();
    } else {
      console.log("Could not fetch: " + key + " with value: " + value + " with model: " + model);
    }

  });

  // Nothing to fetch
  if (_.keys(promises).length === 0){ return next(null, true); }

  Promise
    .props(promises)
    .then((results) => {
      _.each(results, (record, modelKey) => {
        request.data = request.data || {};
        request.data[modelKey] = record;
      });
      return next(null, true);
    })
    .catch(request.server.plugins.db.Errors.DocumentNotFound, function(e) {
      return next(Boom.create(404, 'Could not find a resource'));
    })
    .catch(function(e) {
      next(e, false);
    });
};

export default fetchObject;