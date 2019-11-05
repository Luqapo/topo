const Crag = require('../models/crag');

async function get(regionName) {
  const crags = await Crag.find({ region: regionName });
  return crags.map((c) => ({
    id: c._id,
    name: c.name,
    coordinates: c.location.coordinates,
    sector: c.sector,
    routes: c.routes,
  }));
}

module.exports = {
  get,
};
