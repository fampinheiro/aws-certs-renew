const AWS = require('aws-sdk');

module.exports = async ({ arn, cert, chain, privkey }) => {
  const acm = new AWS.ACM();

  var importCertificateOptions = {
    Certificate: cert,
    PrivateKey: privkey,
    CertificateArn: arn,
    CertificateChain: chain
  };

  return acm.importCertificate(importCertificateOptions).promise();
};
