process.env.NODE_ENV = process.env.NODE_ENV || "test";

import Glue from 'glue';
import * as AppConfig from '../../src/app/config';
import AppRoot from 'app-root-path';

import Lab from 'lab';
import Chai from 'chai';
import ChaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import _ from 'lodash';
import Promise from 'bluebird';

import { startServer } from '../support/initializers/server';

Chai.use(ChaiAsPromised);

global.Lab = Lab;
global.Chai = Chai;

global.assert = Chai.assert;
global.expect = Chai.expect;
global.should = Chai.should();

global.sinon  = sinon;
global._      = _;


// The main function that gets the integration (request) test
// harness ready
let startApp = (cb) => {
  Promise
    .props({
      server: startServer()
    })
    .then(function(result) {
      cb(null, result);
    })
    .catch(function(err) { cb(err); });
}


export { default as BaseFactory } from './factory';
export { startDatabase, stopDatabase } from '../support/initializers/database';
export { startApp };