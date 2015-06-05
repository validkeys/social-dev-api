import Glue from 'glue';
import * as AppConfig from '../../../src/app/config';
import AppRoot from 'app-root-path';

let cachedServer;

let glueOptions = {
  relativeTo: AppRoot.resolve('/src/app')
};

let startServer = function() {

  let glueOptions = {
    relativeTo: AppRoot.resolve('/src/app')
  };

  return new Promise(function(resolve, reject) {
    console.log("Starting server");
    if (cachedServer) {
      return resolve(cachedServer);
    }

    Glue.compose(AppConfig.manifest, glueOptions, function(err, serverInstance) {
      if (err){ console.log("Glue Error!", err); return reject(err); }
      cachedServer = serverInstance;

      serverInstance.start(function(err, startedServer) {
        if (err){ 
          return reject(err); 
        } else {
          console.log("Server started!");
        }
        resolve(cachedServer);
      });
    });
  });
};



// let stopServer = function(instance, cb) {
//   if (instance && instance.stop) {
//     instance.stop({}, function() {
//       cb();
//     });
//   } else {
//     console.log("no instance to stop");
//     cb();
//   }
// };

export { startServer };