const Crag = require('../models/crag');
const Region = require('../models/region');

async function get(regionId) {
  const regionName = (await Region.findById(regionId)).name;
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
