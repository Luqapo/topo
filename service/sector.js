const Sector = require('../models/sector');

// async function get(regionName) {
//   const sectors = await Sector.find({ region: regionName });
//   return sectors.map((s) => ({
//     id: s._id,
//     name: s.name,
//     crags: s.crags,
//   }));
// }

async function get(sectorId) {
  const sector = await Sector.findById(sectorId);
  console.log('TCL: get -> ector', sector);
  return sector.getPublicFields();
}

module.exports = {
  get,
  // getOne,
};
