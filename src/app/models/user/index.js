import { thinky } from '../../initializers/database';
import _ from 'lodash';
import Boom from 'boom';
import Promise from 'bluebird';
import * as PasswordService from '../../services/password';
import moment from 'moment';

let type    = thinky.type;
let User    = null;

const attributes = {
  id:         type.string(),
  firstName:  type.string().min(1).required(),
  lastName:   type.string().min(1).required(),
  username:   type.string().alphanum().min(3).required(),
  email:      type.string().email().required(),
  password:   type.string().min(4).required(),
  createdAt:  type.date().default(moment.utc().format()),
  updatedAt:  type.date().default(moment.utc().format())
};

User = thinky.createModel('users', attributes);

// Indeces
User.ensureIndex("email", function(doc) {
  return doc('email');
});

User.ensureIndex("username", function(doc) {
  return doc('username');
});

// Hooks
// update the updatedAt
User.pre('save', function(next) {
  this.updatedAt = moment.utc().format();
  next();
});

// Generate password salt
User.pre('save', function(next) {
  // if the record is new save right away
  if (!this.isSaved() && [undefined,null].indexOf(this.password) === -1) {
    this.password = PasswordService.encrypt(this.password);
  }
  next();
});

// Ensure email is unique
User.pre('save', function(next) {
  var self = this;
  require('../../lib/models/ensure-unique')("User", "email", self, next);
});

User.pre('save', function(next) {
  var self = this;
  require('../../lib/models/ensure-unique')("User", "username", self, next);
});


// Instance Methods
User.define('jwtAttributes', function() {
  return _.pick(this, ['id','firstName','lastName','username','email','createdAt']);
});

let register = function(server, options, next) {

  User.addListener('ready', (model) => {
    console.log("Table: " + model.getTableName() + " is ready");
    next();
  });

};

register.attributes = {
  pkg: require('./package.json')
};


export { attributes, User, register };