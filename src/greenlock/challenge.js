'use strict';

const Challenge = module.exports;
const domains = require('../domains');

Challenge.create = function(defaults) {
  return {
    getOptions: function() {
      return defaults || {};
    },
    set: Challenge.set,
    get: Challenge.get,
    remove: Challenge.remove,
    loopback: Challenge.loopback,
    test: Challenge.test
  };
};

Challenge.set = function(args, domain, challenge, keyAuthorization, cb) {
  const keyAuthDigest = require('crypto')
    .createHash('sha256')
    .update(keyAuthorization || '')
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  return domains
    .change({
      action: 'UPSERT',
      domain,
      secret: keyAuthDigest
    })
    .then(res => {
      console.log(res);
      return cb();
    })
    .catch(cb);
};

Challenge.get = function(defaults, domain, challenge, cb) {
  return cb(null);
};

Challenge.remove = function(args, domain, challenge, cb) {
  return domains
    .change({
      action: 'DELETE',
      domain
    })
    .then(res => {
      console.log(res);
      return cb();
    })
    .catch(cb);
};
