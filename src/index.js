const isAfter = require('date-fns/is_after');
const parse = require('date-fns/parse');
const subDays = require('date-fns/sub_days');

const certificates = require('./certificates');
const domains = require('./domains');
const greenlock = require('./greenlock');

module.exports = async () => {
  const renewCertificates = await getCertificates();
  const promises = renewCertificates.map(async certificate => {
    const details = await domains.details({ domain: certificate.DomainName });

    const { cert, chain, privkey } = await greenlock({
      email: details.AdminContact.Email,
      domain: certificate.DomainName
    });

    await certificates.import({
      cert,
      privkey,
      chain,
      arn: certificate.CertificateArn
    });

    return certificate;
  });

  return Promise.all(promises);
};

async function getCertificates() {
  const list = await certificates.list();
  const listDetails = list.map(async c => {
    const details = await certificates.get({
      arn: c.CertificateArn
    });

    return details.Certificate;
  });

  return (await Promise.all(listDetails)).filter(c => {
    const expireDate = subDays(parse(c.NotAfter), 30);

    return isAfter(new Date(), expireDate);
  });
}
