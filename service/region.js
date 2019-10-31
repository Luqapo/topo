const Region = require('../models/region');

async function get(areaName) {
  const regions = await Region.find({ area: areaName });
  console.log('TCL: get -> regions', regions);
  return regions.map((r) => ({
    name: r.name,
    crags: r.crags,
    sectors: r.sectors,
  }));
}

module.exports = {
  get,
};
