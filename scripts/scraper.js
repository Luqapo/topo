const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { argv } = require('yargs')
  .options({
    filename: {
      alias: 'f',
      demandOption: true,
      describe: 'output filename',
      type: 'string',
    },
  });

async function scrap(filename) {
  const urlBase = 'http://topo.portalgorski.pl/';
  const url = '';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${urlBase}${url}`, { waitUntil: 'networkidle2' });
  const html = await page.content();
  fs.writeFileSync(path.join(__dirname, '..', 'data', `${filename}.html`), html);
  return browser.close();
}

if(!argv.help) {
  scrap(argv.filename)
    .then(() => console.log('Downloaded'))
    .catch((err) => {
      console.error(`Failed: ${err.message}\n\n${err.stack}`);
      process.exit(-1);
    });
}
