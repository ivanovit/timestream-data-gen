const dataGenerator = require('./data-generator');
const { writeRecords } = require('./aws');

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const sendDataInterval = parseInt(process.env.VAR_INTERVAL_SECONDS, 10) || 20;
const durationMinutes = parseInt(process.env.VAR_DURATION_MINUTES, 10) || 1;

const batchedRecords = dataGenerator.generateBatched();

if (durationMinutes > 60) {
  durationMinutes = 60;
}

if (sendDataInterval && sendDataInterval > 0) {
  let batchesSent = 0;

  console.log(`Start sending data on ${sendDataInterval} sec for ${durationMinutes} minutes`);

  const endTime = addMinutes(new Date(), durationMinutes);

  const interval = setInterval(() => {
    if (new Date().getTime() >= endTime.getTime()) {
      console.log(`Time elapsed ${durationMinutes} minutes`);
      console.log(`Sent: ${batchesSent} batches x 100 = ${batchesSent * 100} data points`)

      clearInterval(interval);
      process.exit();
    }

    batchIndex = batchesSent % (batchedRecords.length - 1);

    console.log(`Sending batch ${batchIndex}, ${batchIndex + 1}`);

    writeRecords(batchedRecords[batchIndex]);
    writeRecords(batchedRecords[batchIndex + 1]);

    batchesSent += 2;
  }, sendDataInterval * 1000);
}