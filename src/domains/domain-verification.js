const AWS = require('aws-sdk');

module.exports = async ({ domain, secret }) => {
  const route53 = new AWS.Route53();
  const hostedZones = await route53
    .listHostedZonesByName({
      DNSName: domain
    })
    .promise();

  const [type, value] = secret.split(' ');
  const hostedZone = hostedZones.HostedZones.filter(
    hz => hz.Name === `${domain}.`
  )[0];

  const hostedZoneId = hostedZone.Id;
  const recordSetsChanges = await route53
    .changeResourceRecordSets({
      ChangeBatch: {
        Changes: [
          {
            Action: 'UPSERT',
            ResourceRecordSet: {
              Name: `_acme-challenge.${domain}`,
              ResourceRecords: [
                {
                  Value: `"${value}"`
                }
              ],
              TTL: 60,
              Type: type
            }
          }
        ],
        Comment: "Let's Encrypt Challenge"
      },
      HostedZoneId: hostedZoneId
    })
    .promise();

  const waitForOptions = {
    Id: recordSetsChanges.ChangeInfo.Id
  };

  return route53.waitFor('resourceRecordSetsChanged', waitForOptions).promise();
};
