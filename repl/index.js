var repl  = require('repl');
var _     = require('lodash');

var models    = require('../src/app/models');
var AppConfig = require('../src/app/config');
var thinky    = require('thinky');

var dbConfig        = AppConfig.database["development"];
var thinkyInstance  = thinky(dbConfig);
var r               = thinkyInstance.r;

thinkyInstance._onDbReady.push(function() {

  var replServer = repl.start({
    prompt: 'app >'
  });

  replServer.context.db     = thinkyInstance;
  replServer.context.models = models;
  replServer.context.r      = r;
  replServer.context._      = _;

});


module.exports = repl;