// will do a query based on a single field
// and return whether or not the field is unique
// if the instance is a created model, it will 
// ensure that it's not finding it's own record

import * as Models from '../../models';
import Promise from 'bluebird';


export default (tableName, field, instance, next) => {

  if ([undefined,null].indexOf(instance[field]) > -1)
    return next();

  if (!Models[tableName] || !Models[tableName]){ return next(new Error(tableName + "not found in models export")); }
  let model       = Models[tableName],
      filterFunc  = null;

  if (instance.isSaved()) {
    filterFunc = (item) => {
      return item(field).eq(instance[field]).and(item("id").ne(instance.id));
    };
  } else {
    filterFunc = (item) => {
      return item(field).eq(instance[field]);
    }
  }

  model
    .filter(filterFunc)
    .run()
    .then((results) => {
      if (results.length > 0) {
        return next(new Error(field + " is not unique in " + tableName));
      }
      next();
    })
    .catch(function(e) {
      next(e);
    });
}