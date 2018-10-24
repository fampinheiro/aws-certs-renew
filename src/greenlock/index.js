const Greenlock = require('greenlock');

module.exports = async ({ domain, email, register }) => {
  const greenlock = Greenlock.create({
    version: 'draft-12',
    configDir: '/tmp/acme-challenges',
    communityMember: false,
    challengeType: 'dns-01',
    challenges: {
      'dns-01': require('./challenge')
    },
    server: 'https://acme-v02.api.letsencrypt.org/directory'
  });

  return greenlock.register({
    agreeTos: true,
    email,
    challengeType: 'dns-01',
    rsaKeySize: 2048,
    domains: [domain],
    debug: true
  });
};
