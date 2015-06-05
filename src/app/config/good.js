export default {
  reporters: [{
    reporter: require('good-console'),
    events: {
      response: '*',
      log:      '*',
      error:    '*',
      ops:      '*'
    }
  }]
};