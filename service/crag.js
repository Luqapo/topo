const Crag = require('../models/crag');
const Region = require('../models/region');
const Route = require('../models/route');

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

async function getOne(cragId) {
  const crag = await Crag.findById(cragId);
  const routes = await Route.find({ crag: crag.name });
  console.log('TCL: getOne -> routes', routes);
  return { ...crag, routes };
}

module.exports = {
  get,
  getOne,
};
