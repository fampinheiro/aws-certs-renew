const Greenlock = require('greenlock');
const capture = require('./capture');

module.exports = async ({ domain, email, register }) => {
  const greenlock = Greenlock.create({
    version: 'draft-12',
    communityMember: false,
    challengeType: 'dns-01',
    challenges: {
      'dns-01': require('le-challenge-dns')
    },
    server: 'https://acme-v02.api.letsencrypt.org/directory'
  });

  const cachedCertificates = await greenlock.check({
    domains: [domain]
  });

  if (cachedCertificates) {
    return cachedCertificates;
  }

  const listener = capture(domain, await register);
  try {
    const certificates = await greenlock.register({
      agreeTos: true,
      email,
      challengeType: 'dns-01',
      rsaKeySize: 2048,
      domains: [domain],
      debug: true
    });
    return certificates;
  } catch (err) {
    listener();
    throw err;
  }
};
