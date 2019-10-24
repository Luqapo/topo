const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('node-fetch');
// eslint-disable-next-line import/no-extraneous-dependencies
const { argv } = require('yargs')
  .options({
    filename: {
      alias: 'f',
      demandOption: true,
      describe: 'output filename',
      type: 'string',
    },
    url: {
      alias: 'u',
      demandOption: true,
      describe: 'url to json',
      type: 'string',
    },
  });

async function getJson(url, filename) {
  try {
    const data = await fetch(url);
    const json = await data.json();
    fs.writeFileSync(path.join(__dirname, '..', 'data', `${filename}.json`), JSON.stringify(json.results));
  } catch(err) {
    console.error('ERROR ->', err.message);
  }
}

if(!argv.help) {
  getJson(argv.url, argv.filename)
    .then(() => console.log('Downloaded'))
    .catch((err) => {
      console.error(`Failed: ${err.message}\n\n${err.stack}`);
      process.exit(-1);
    });
}
