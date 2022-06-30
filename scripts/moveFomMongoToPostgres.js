/* eslint-disable no-await-in-loop */
const Area = require('../models/area');
const Region = require('../models/region');
const Sector = require('../models/sector');
const Crag = require('../models/crag');
const Route = require('../models/route');
const dbInit = require('../db/db');
const rdbms = require('../service/rdbms');

function getOldAreas() {
  return Area.find({});
}

async function getRegions() {
  const areas = await rdbms.query('SELECT * FROM catalog.region');
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 20 ~ run ~ areas', areas.rows);

  return areas.rows;
}

async function getRegionsForArea(areaName) {
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 5 ~ getRegionsForArea ~ areaName', areaName);
  const regions = await Region.find({ area: areaName });

  return regions;
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

async function insertSector(sector, areaId) {
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 89 ~ insertSector ~ areaId', areaId);
  const sql = `INSERT INTO catalog.sector (name,area_id)
  VALUES ($1,$2) RETURNING id;
  `;
  console.log(sql, { name: sector.name, areaId });
  const [{ id }] = (await rdbms.query(sql, ...[sector.name, areaId])).rows;

  const crags = await getCragsForSector(sector.name);
  const promises = crags.map((c) => insertCrag(c, id));
  await Promise.all(promises);
}

async function insertArea(region, regionId) {
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 101 ~ insertArea ~ regionId', regionId);
  const sql = `INSERT INTO catalog.area (name,region_id)
  VALUES ($1,$2) RETURNING id;
  `;
  console.log(sql, [region.name, regionId]);
  const [{ id }] = (await rdbms.query(sql, ...[region.name, regionId])).rows;
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 88 ~ insertArea ~ newArea', id);

  const sectors = await getSectorsForArea(region.name);
  const promises = sectors.map((s) => insertSector(s, id));
  await Promise.all(promises);
}

async function insertRegion(region) {
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 114 ~ insertRegion ~ region', region);
  const sql = `INSERT INTO catalog.region (name,long,lat,geom)
  VALUES ($1,$2,$3, ST_GeomFromText('POINT(${region.location.coordinates[1]} ${region.location.coordinates[0]})', 2180)) RETURNING id;
  `;
  console.log(sql, [region.name, region.location.coordinates[1], region.location.coordinates[0]]);
  const [{ id }] = (await rdbms.query(sql, ...[
    region.name,
    region.location.coordinates[1],
    region.location.coordinates[0],
  ])).rows;
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 124 ~ insertRegion ~ id', id);
}

async function insertRegions() {
  const oldAreas = await getOldAreas();
  const promises = oldAreas.map((a) => insertRegion(a));
  await Promise.all(promises);
}

async function run() {
  await dbInit;
  await rdbms.init();
  await insertRegions();
  const areas = await getRegions();
  console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 20 ~ run ~ areas', areas);
  for(let i = 0; i < areas.length; i++) {
    console.log(areas[i].name);
    const regions = await getRegionsForArea(areas[i].name);
    console.log(regions.forEach((r) => console.log(r.name)));
    const promises = regions.map((r) => insertArea(r, areas[i].id));
    await Promise.all(promises);
  }
}

// async function run() {
//   const routes = await getRoutesForCrag('Wielbłąd');
//   console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 124 ~ run ~ routes', routes);
//   console.log('🚀 ~ file: moveFomMongoToPostgres.js ~ line 124 ~ run ~ routes', routes.length);
// }

run()
  .then(() => console.log('End'))
  .catch((err) => console.error(err));
