import { database } from '../../../src/app/config/';
import thinky from 'thinky';

let r;

let startDatabase = function(next) {

  let dbConfig          = database['test'],
      thinkyInstance    = thinky(dbConfig);
  
  r = thinkyInstance.r;

  thinkyInstance._onDbReady.push(function() {
    console.info("Database ("+dbConfig.db+") Is Connected on port: " + dbConfig.port);
    next(thinkyInstance, r);
  });

};

let stopDatabase = function(next) {
  r.getPool().drain();
  next();
};

export { startDatabase, stopDatabase };