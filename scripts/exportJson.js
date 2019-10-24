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
const Crag = require('../models/crag');
const Rock = require('../models/rock');

const sudetyCoordinates = { lat: 50.69728468000, lng: 16.20918665000 };
const juraCoordinates = { lat: 50.45427771000, lng: 19.55495313000 };

async function exportData(filename) {
  const data = fs.readFileSync(path.join(__dirname, '..', 'data', `${filename}.json`));
  const json = await JSON.parse(data);
  let areaName, regionName, cragName;
  json.forEach((item) => {
    let coordinates;
    const regionRegex = /.+,region,[0-9]+/g;
    const cragRegex = /.+,sektor,[0-9]+/g;
    if(item.type === 'area') {
      areaName = item.title;
      if(areaName === 'Jura Krakowsko Częstochowska') {
        coordinates = juraCoordinates;
      } else {
        coordinates = sudetyCoordinates;
      }
      Area.create({
        name: areaName,
        location: {
          type: 'Point',
          coordinates: [coordinates.lat, coordinates.lng],
        },
      });
      console.log('AREA name --------->', areaName);
    }
    if(regionRegex.test(item.url)) {
      regionName = item.url.substr(1);
      // eslint-disable-next-line prefer-destructuring
      regionName = regionName.split(',')[0];
      Region.create({
        name: regionName,
        area: areaName,
      });
      console.log('REGION ----->', regionName);
    }
    if(cragRegex.test(item.url)) {
      cragName = item.url.substr(1);
      // eslint-disable-next-line prefer-destructuring
      cragName = cragName.split(',')[0];
      Crag.create({
        name: cragName || regionName,
        region: regionName,
      });
      console.log('Sektor ----->', cragName || regionName);
    }
    if(item.type === 'rock' && item.title) {
      Rock.create({
        name: item.title,
        location: {
          type: 'Point',
          coordinates: [item.lat, item.lng],
        },
        crag: cragName || regionName,
      });
      console.log('Skała ->', item.title);
    }
  });
}

if(!argv.help) {
  dbInit
    .then(() => {
      exportData(argv.filename);
    })
    .then(() => console.log('Exported'))
    .catch((err) => {
      console.error(`Failed: ${err.message}\n\n${err.stack}`);
      process.exit(-1);
    });
}
