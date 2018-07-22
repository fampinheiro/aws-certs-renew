const AWS = require('aws-sdk');

module.exports = async ({ domain }) => {
  const route53 = new AWS.Route53Domains();
  return route53
    .getDomainDetail({
      DomainName: domain
    })
    .promise();
};
