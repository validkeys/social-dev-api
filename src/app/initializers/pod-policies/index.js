import glob from 'glob';
import AppRoot from 'app-root-path';
import Promise from 'bluebird';

let loadPolicies = (server, next) => {
  console.log("Auto registering pod policies");
  let directories = glob.sync(AppRoot.resolve("/src/app/pods/*/policies")),
      promises    = [];

  directories.forEach(function(directory) {
    let newPromise = new Promise(function(resolve, reject) {
      server.plugins.mrhorse.loadPolicies(server, {
        policyDirectory:    directory,
        defaultApplyPoint:  'onPreHandler'
      }, function(err) {
        if (err) {
          console.log("Error loading " + directory + " policy");
          reject(err);          
        } else {
          resolve();
        }
      });
    });

    promises.push(newPromise);
  });

  Promise
    .all(promises)
    .then(function() {
      next();
    })
    .catch(function(err){ next(err); })

};

let register = (server, options, next) => {
  server.after(loadPolicies, 'mrhorse');
  next();
};

register.attributes = {
  pkg: require('./package.json')
};

export default register;