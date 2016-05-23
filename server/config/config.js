var _ = require('lodash');
var log = require('db.log');

var config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  port: process.env.PORT || 3000,
  // 10 days in minutes
  expireTime: 10 * 24 * 60 * 60,
  secrets: {
    jwt: process.env.JWT || 'purpleUnicorn'
  }
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

var envConfig;

try {
  envConfig = require('./' + config.env);
  envConfig = envConfig || {};
} catch(e) {
  envConfig = {};
}

// Setup db.log logging.
process.env.loggingOff = envConfig.loggingOff || false;

// merge the two config files together
// the envConfig file will overwrite properties
// on the config object
module.exports = _.merge(config, envConfig);
