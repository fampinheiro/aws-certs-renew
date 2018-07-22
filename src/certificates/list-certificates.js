const AWS = require('aws-sdk');

module.exports = async () => {
  const acm = new AWS.ACM();

  const certificates = await acm.listCertificates().promise();
  return certificates.CertificateSummaryList;
};
