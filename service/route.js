const Route = require('../models/route');
const Crag = require('../models/crag');

async function get(cragId) {
  console.log('TCL: get -> cragId', cragId);
  const cragName = (await Crag.findById(cragId)).name;
  console.log('TCL: get -> cragName', cragName);
  const routes = await Route.find({ crag: cragName });
  return routes.map((r) => ({
    id: r._id,
    name: r.name,
    grade: r.grade,
    protection: r.protection,
    author: r.author,
    year: r.year,
    length: r.length,
    ascents: r.ascents,
  }));
}

module.exports = {
  get,
};
