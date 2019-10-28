const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

async function extract(data) {
  const object = {};
  const data = fs.readFileSync(path.join(__dirname, '..', 'data', 'abazy.html'));
  const $ = cheerio.load(data);
  $('.row').each((i, el) => {
    const route = {};
    $(el).children().each((index, elem) => {
      // console.log('INDEX ->', index, $(elem).text());
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
    object[route.name] = route;
  });
  console.log('RESULT ->', object);
}

extract()
  .then(() => console.log('Extracted'))
  .catch((err) => console.error(err));
