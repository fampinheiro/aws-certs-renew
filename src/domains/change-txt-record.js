const AWS = require('aws-sdk');

module.exports = async ({ action, domain, secret }) => {
  const route53 = new AWS.Route53();
  const hostedZones = await route53
    .listHostedZonesByName({
      DNSName: domain
    })
    .promise();

  const hostedZone = hostedZones.HostedZones.filter(
    hz => hz.Name === `${domain}.`
  )[0];

  const hostedZoneId = hostedZone.Id;
  const recordSetsChanges = await route53
    .changeResourceRecordSets({
      ChangeBatch: {
        Changes: [
          {
            Action: action,
            ResourceRecordSet: {
              Name: `_acme-challenge.${domain}`,
              ResourceRecords: secret && [
                {
                  Value: `"${secret}"`
                }
              ],
              TTL: 60,
              Type: 'TXT'
            }
          }
        ],
        Comment: 'greenlock txt challenge'
      },
      HostedZoneId: hostedZoneId
    })
    .promise();

  const waitForOptions = {
    Id: recordSetsChanges.ChangeInfo.Id
  };

  return route53.waitFor('resourceRecordSetsChanged', waitForOptions).promise();
};
