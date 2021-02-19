const AWS = require('aws-sdk');
const https = require('https');
// const { getAllRows } = require('./test-connection');

const tableName = process.env.VAR_TABLE_NAME || 'stgus3-usage';

const agent = new https.Agent({
  maxSockets: 5000,
});

const writeClient = new AWS.TimestreamWrite({
  maxRetries: 10,
  httpOptions: {
    timeout: 2000,
    agent,
  },
  region: 'us-east-2',
});

async function writeRecords(records) {
  const commonAttributes = {
    MeasureValueType: 'BIGINT',
    Time: Date.now().toString(),
  };

  const params = {
    DatabaseName: 'usage-spike',
    TableName: tableName,
    Records: records,
    CommonAttributes: commonAttributes,
  };

  const request = writeClient.writeRecords(params);

  await request.promise().then(
    () => {},
    (err) => {
      console.log('!=== Error writing records:', err);
      if (err.code === 'RejectedRecordsException') {
        const responsePayload = JSON.parse(request.response.httpResponse.body.toString());
        console.log('RejectedRecords: ', responsePayload.RejectedRecords);
        console.log('Other records were written successfully. ');
      }
    },
  );
}

module.exports = {
  writeRecords,
};
