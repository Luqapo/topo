/* eslint-disable no-await-in-loop */
const Region = require('../models/region');
const Sector = require('../models/sector');
const Crag = require('../models/crag');
const Route = require('../models/route');
const dbInit = require('../db/db');
const rdbms = require('../service/rdbms');

async function getArea(regionName) {
  console.log('🚀 ~ file: migrateCragsWoSector.js ~ line 17 ~ getRegion ~ regionName', regionName);
  const regions = await rdbms.query('SELECT * FROM catalog.area WHERE name = $1', regionName);

  return regions.rows[0];
}

async function getSectorsForArea(area) {
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 21 ~ getSectorsForArea ~ area', area);
  const sectors = await Sector.find({ region: area });

  return sectors;
}

async function getCragsForSector(sector) {
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 31 ~ getCragsForSector ~ sector', sector);
  const crags = await Crag.find({ sector });

  return crags;
}

async function getRoutesForCrag(crag) {
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 38 ~ getRoutesForCrag ~ crag', crag);
  const routes = await Route.find({ crag });

  return routes;
}

async function insertRoute(route, cragId) {
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 45 ~ insertRoute ~ cragId', cragId);
  const sql = `INSERT INTO catalog.route (name,crag_id,grade,year,author,protection,length)
  VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id;
  `;
  // console.log(sql, {
  //   name: route.name,
  //   cragId,
  //   grade: route.grade,
  //   year: route.year,
  //   author: route.author,
  //   protection: route.protection,
  //   length: route.length,
  // });
  console.log(route.length);
  console.log(route.length.split(' ')[0] || 0);
  const [{ id }] = (await rdbms.query(sql, ...[
    route.name,
    cragId,
    route.grade,
    route.year || 0,
    route.author,
    route.protection,
    route.length.split(' ')[0] || 0,
  ])).rows;
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 67 ~ insertRoute ~ id', id);
}

async function insertCrag(crag, sectorId) {
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 72 ~ insertCrag ~ sectorId', sectorId);
  const sql = `INSERT INTO catalog.crag (name,sector_id,long,lat,geom)
  VALUES ($1,$2,$3,$4, ST_GeomFromText('POINT(${crag.location.coordinates[1]} ${crag.location.coordinates[0]})', 2180)) RETURNING id;
  `;
  console.log(sql, [crag.name, sectorId, crag.location.coordinates[1], crag.location.coordinates[0]]);
  const [{ id }] = (await rdbms.query(sql, ...[
    crag.name,
    sectorId,
    crag.location.coordinates[1],
    crag.location.coordinates[0],
  ])).rows;

  const routes = await getRoutesForCrag(crag.name);
  const promises = routes.map((r) => insertRoute(r, id));
  await Promise.all(promises);
}

async function insertSector(sectorName, areaId) {
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 89 ~ insertSector ~ areaId', areaId);
  const sql = `INSERT INTO catalog.sector (name,area_id)
  VALUES ($1,$2) RETURNING id;
  `;
  console.log(sql, { name: sectorName, areaId });
  const [{ id }] = (await rdbms.query(sql, ...[sectorName, areaId])).rows;

  return id;
}

async function run() {
  await dbInit;
  await rdbms.init();
  const cragsWoSector = await getCragsForSector('');
  for(let i = 0; i < cragsWoSector.length; i++) {
    console.log(cragsWoSector[i].name);
    const area = await getArea(cragsWoSector[i].region);
    console.log('🚀 ~ file: migrateCragsWoSector.js ~ line 125 ~ run ~ area', area);
    const sectorId = await insertSector(cragsWoSector[i].name, area.id);
    await insertCrag(cragsWoSector[i], sectorId);
  }
}

run()
  .then(() => console.log('End'))
  .catch((err) => console.error(err));
