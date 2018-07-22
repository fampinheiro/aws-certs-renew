const AWS = require('aws-sdk');

module.exports = async ({ arn }) => {
  const acm = new AWS.ACM();
  return acm
    .describeCertificate({
      CertificateArn: arn
    })
    .promise();
};
