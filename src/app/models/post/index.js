import { thinky } from '../../initializers/database';
import _ from 'lodash';
import Boom from 'boom';
import Promise from 'bluebird';
import moment from 'moment';

let type    = thinky.type;
let Post    = null;

const attributes = {
  id:         type.string(),
  type:       type.string().min(1).required(),
  body:       type.string().min(1).required(),
  userId:     type.number().required(),
  createdAt:  type.date().default(moment.utc().format()),
  updatedAt:  type.date().default(moment.utc().format())
};

Post = thinky.createModel('posts', attributes);

// Indeces
Post.ensureIndex("userId", function(doc) {
  return doc('userId');
});

Post.ensureIndex("type", function(doc) {
  return doc('type');
});

// Hooks
// update the updatedAt
Post.pre('save', function(next) {
  this.updatedAt = moment.utc().format();
  next();
});


let register = function(server, options, next) {

  Post.addListener('ready', (model) => {
    console.log("Table: " + model.getTableName() + " is ready");
    next();
  });

};

register.attributes = {
  pkg: require('./package.json')
};


export { attributes, Post, register };