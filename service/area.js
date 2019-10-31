const Area = require('../models/area');

async function getAll() {
  const areas = await Area.find({});
  return areas.map((a) => ({ name: a.name, coordinates: a.location.coordinates }));
}

module.exports = {
  getAll,
};
