const Area = require('../models/area');

async function getAll() {
  const areas = await Area.find({});
  return areas.map((a) => ({ id: a._id, name: a.name, coordinates: a.location.coordinates }));
}

module.exports = {
  getAll,
};
