import { database } from '../../config/';
import thinky from 'thinky';

let dbConfig          = database[process.env.NODE_ENV || 'development'],
    thinkyInstance    = thinky(dbConfig),
    r                 = thinkyInstance.r,
    Errors            = thinkyInstance.Errors;

let register = function(server, options, next) {

  thinkyInstance._onDbReady.push(function() {
    console.info("Database ("+dbConfig.db+") Is Connected on port: " + dbConfig.port);

    server.expose('thinky', thinkyInstance);
    server.expose('r', r);
    server.expose('Errors',Errors);

    next();
  });

}

register.attributes = {
  pkg: require('./package.json')
}

export { thinkyInstance as thinky, r, register };