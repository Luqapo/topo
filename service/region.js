const Region = require('../models/region');
const Area = require('../models/area');

async function get(areaId) {
  const area = await Area.findById(areaId)
  const regions = await Region.find({ area: area.name });
  return regions.map((r) => ({
    id: r._id,
    name: r.name,
  }));
}

async function getOne(reginId) {
  const region = await Region.findById(reginId);
  return region.getPublicFields();
}

module.exports = {
  get,
  getOne,
};
