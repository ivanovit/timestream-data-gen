function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generate() {
  const rand = getRandom(100, 999);

  const dimensions = [
    { Name: 'kid', Value: `kid-${rand}` },
    { Name: 'org', Value: `org-${rand}` },
  ];

  const activeUsers = {
    Dimensions: dimensions,
    MeasureName: 'active_users',
    MeasureValue: `${getRandom(1, 100)}`,
  };

  const apiCounts = {
    Dimensions: dimensions,
    MeasureName: 'api_counts',
    MeasureValue: `${getRandom(1, 100)}`,
  };

  return {
    records: [activeUsers, apiCounts],
  };
}

module.exports = {
  generate,
};
