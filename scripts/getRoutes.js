/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
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

const Route = require('../models/route');

let mongoose;

function extract(data, cragName) {
  const promises = [];
  const $ = cheerio.load(data);
  $('.row').each((i, el) => {
    const route = {};
    $(el).children().each((index, elem) => {
      route.crag = cragName;
      if(index === 1) {
        route.name = ($(elem).text()).trim();
      } else if(index === 2) {
        route.protection = ($(elem).text()).trim();
      } else if(index === 3) {
        route.grade = ($(elem).text()).trim();
      } else if(index === 5) {
        route.author = ($(elem).text()).trim();
      } else if(index === 6) {
        route.year = ($(elem).text()).trim();
      } else if(index === 7) {
        route.length = ($(elem).text()).trim();
      }
    });
    console.log('ROUTE -->', route.name);
    promises.push(Route.create(route));
  });
  return Promise.all(promises);
}

async function loadContent(browser, url) {
  const urlBase = 'http://topo.portalgorski.pl/';
  const page = await browser.newPage();
  await page.goto(`${urlBase}${url}`, { waitUntil: 'networkidle0' });
  const context = await page.content();
  await page.close();
  return context;
}

async function* getRoutes(json, browser) {
  for(let i = 0; i < json.length; i++) {
    await loadContent(browser, json[i].url)
      .then((c) => extract(c, json[i].title))
      .then(() => console.log('CRAG EXTRACTED ->', json[i].title))
      .catch((err) => console.error(err.message));
    yield json[i].title;
  }
}

async function scraper(jsonFilename) {
  const data = fs.readFileSync(path.join(__dirname, '..', 'data', `${jsonFilename}.json`));
  const browser = await puppeteer.launch();
  const json = (await JSON.parse(data)).filter((e) => e.type === 'rock');
  for await (const crags of (getRoutes(json, browser))) {
    console.log('RESULT ->', crags);
  }
  return browser.close();
}

if(!argv.help) {
  dbInit
    .then((db) => {
      mongoose = db;
      return scraper(argv.filename);
    })
    .then(() => console.log('Exported'))
    .catch((err) => {
      console.error(`Failed: ${err.message}\n\n${err.stack}`);
      process.exit(-1);
    }).finally(() => mongoose.connection.close());
}
