import Factory from 'factory-girl';
import RethinkAdapter from 'factory-girl-rethinkdb';
import {
  User as UserFactory
} from '../factories';

import _ from 'lodash';

let baseFactory = new Factory.Factory();
baseFactory.setAdapter(RethinkAdapter);

UserFactory(baseFactory);

export default baseFactory;