const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { argv } = require('yargs')
  .options({
    filename: {
      alias: 'f',
      demandOption: true,
      describe: 'output filename',
      type: 'string',
    },
  });
const dbInit = require('../db/db');

const Area = require('../models/area');
const Region = require('../models/region');
const Sector = require('../models/sector');
const Crag = require('../models/crag');

const sudetyCoordinates = { lat: 50.69728468000, lng: 16.20918665000 };
const juraCoordinates = { lat: 50.45427771000, lng: 19.55495313000 };

let mongoose;

const regions = {};
const sectors = {};

async function exportData(filename) {
  const data = fs.readFileSync(path.join(__dirname, '..', 'data', `${filename}.json`));
  const json = await JSON.parse(data);
  const promises = [];
  let areaName, regionName, sectorName;
  json.forEach((item) => {
    let coordinates;
    const regionRegex = /.+,region,[0-9]+/g;
    const sectorRegex = /.+,sektor,[0-9]+/g;
    if(item.type === 'area') {
      areaName = item.title;
      if(areaName === 'Jura Krakowsko Częstochowska') {
        coordinates = juraCoordinates;
      } else {
        coordinates = sudetyCoordinates;
      }
      const area = {
        name: areaName,
        location: {
          type: 'Point',
          coordinates: [coordinates.lat, coordinates.lng],
        },
      };
      promises.push(Area.create(area));
    }
    if(regionRegex.test(item.url)) {
      regionName = item.url.substr(1);
      // eslint-disable-next-line prefer-destructuring
      regionName = regionName.split(',')[0];
      sectorName = '';
      const region = {
        name: regionName,
        area: areaName,
        crags: [],
        sectors: [],
      };
      regions[regionName] = region;
    }
    if(sectorRegex.test(item.url) && item.url) {
      sectorName = item.url.substr(1);
      // eslint-disable-next-line prefer-destructuring
      sectorName = sectorName.split(',')[0];
      if(!sectorName) return;
      const sector = {
        name: sectorName,
        region: regionName,
        crags: [],
      };
      regions[regionName].sectors.push(sectorName);
      sectors[sectorName] = sector;
    }
    if(item.type === 'rock' && item.title) {
      const crag = {
        name: item.title,
        location: {
          type: 'Point',
          coordinates: [item.lat, item.lng],
        },
        sector: sectorName,
        region: regionName,
      };
      regions[regionName].crags.push(item.title);
      const checkSectorRegex = new RegExp(`.+,${sectorName},.+`, 'g');
      const inSector = checkSectorRegex.test(item.url);
      if(inSector) {
        sectors[sectorName].crags.push(item.title);
      }
      promises.push(Crag.create(crag));
    }
  });

  Object.keys(regions).forEach((r) => {
    promises.push(Region.create(regions[r]));
  });
  Object.keys(sectors).forEach((s) => {
    promises.push(Sector.create(sectors[s]));
  });
  console.log('REGIONS ->', regions);
  console.log('SECTORS ->', sectors);
  return Promise.all(promises);
}

if(!argv.help) {
  dbInit
    .then((db) => {
      mongoose = db;
      return exportData(argv.filename);
    })
    .then(() => console.log('Exported'))
    .catch((err) => {
      console.error(`Failed: ${err.message}\n\n${err.stack}`);
      process.exit(-1);
    }).finally(() => mongoose.connection.close());
}
