/* eslint-disable no-await-in-loop */
const dbInit = require('../db/db');
const rdbms = require('../service/rdbms');
const Route = require('../models/route');

function getRoutes() {
  return Route.find({});
}

async function getRoutesFromPostgres(routeName, cragName) {
  const routes = await rdbms.query(`
    SELECT cr.*, cc.name as crag
    FROM catalog.route cr
    LEFT JOIN catalog.crag cc ON cc.id = cr.crag_id
    WHERE cr.name = $1 AND cc.name = $2`, routeName, cragName);

  return routes.rows;
}

async function run() {
  await dbInit;
  await rdbms.init();
  const routes = await getRoutes();
  for(let i = 0; i < routes.length; i++) {
    const routeFromPostgres = await getRoutesFromPostgres(routes[i].name, routes[i].crag);
    if(routeFromPostgres.length > 1) {
      console.log(routes[i].name);
      console.log('🚀 ~ file: testRoutes.js ~ line 18 ~ run ~ routeFromPostgres', routeFromPostgres);
    }
  }
}

run()
  .then(() => console.log('End'))
  .catch((err) => console.error(err));
