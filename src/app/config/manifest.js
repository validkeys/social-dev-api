import good from './good';
import mrhorse from './mrhorse';

export default {
  connections: [
    {
      host:   'localhost',
      port:   3000,
      labels: ['api'],
      routes: {
        cors: {
          origin: ['*']
        },
        plugins: {
          policies: ['fetch-object']
        }
      }
    }
  ],
  plugins: {
    "good":                     good,
    "mrhorse":                  mrhorse,
    "hapi-auth-jwt":            null,
    "./initializers/database":  null,
    './initializers/authentication': null,
    "./models/user":            null,
    "./models/post":            null,
    "./pods/sessions":          null,
    "./pods/users":             null,
    "./pods/posts":             null
  }
}