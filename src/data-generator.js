const metricsCount = parseInt(process.env.VAR_METRICS, 10) || 7;
const dimensionsCount = parseInt(process.env.VAR_LABELS, 10) || 2;
const firstLabelValues = parseInt(process.env.VAR_FIRST_LABEL_VALUES, 10) || 3000;
const otherLabelValues = parseInt(process.env.VAR_OTHER_LABEL_VALUES, 10) || 10;
const metricNamePrefix = process.env.VAR_METRIC_NAME || 'metric_name';
const labelNamePrefix = process.env.VAR_LABEL_NAME || 'label_name';
const labelValuePrefix = process.env.VAR_LABEL_VALUE || 'label_value';

function generate() {
  const recordsTemplate = [];
  const records = [];
  const dimensions = [];

  for (let j = 0; j < dimensionsCount; j += 1) {
    dimensions.push({ Name: `${labelNamePrefix}${j + 1}` });
  }

  for (let i = 0; i < metricsCount; i += 1) {
    recordsTemplate.push({ MeasureName: `${metricNamePrefix}${i + 1}_total` });
  }

  for (let valueIndex = 1; valueIndex <= firstLabelValues; valueIndex += 1) {
    for (let otherValueIndex = 1; otherValueIndex <= otherLabelValues; otherValueIndex += 1) {
      recordsTemplate.forEach((recordTemplate) => {
        const record = {
          MeasureName: recordTemplate.MeasureName,
          MeasureValue: '1',
          Dimensions: [
            { Name: dimensions[0].Name, Value: `${labelValuePrefix}${valueIndex}` },
            { Name: dimensions[1].Name, Value: `${labelValuePrefix}${otherValueIndex}` },
          ],
        };

        records.push(record);
      });
    }
  }

  return records;
}

function generateBatched(batchSize = 100) {
  const records = generate();
  const batchedRecords = [];

  const batchCount = Math.ceil(records.length / batchSize);

  for (let index = 0; index < batchCount; index += 1) {
    batchedRecords.push(records.slice(index * batchSize, (index + 1) * batchSize));
  }

  console.log(`Generated data points: ${records.length}`);
  console.log(`Batched data points: ${batchedRecords.length} batches x ${batchSize}`);

  return batchedRecords;
}

module.exports = {
  generate,
  generateBatched,
};
