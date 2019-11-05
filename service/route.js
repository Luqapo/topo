const Route = require('../models/route');

async function get(cragName) {
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
