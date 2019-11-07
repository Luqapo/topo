const request = require('supertest');
const { expect } = require('chai');

const appInit = require('../../app');

let app;

describe('route routes', () => {
  let regionId;
  let cragId;
  before(async () => {
    app = await appInit();
  });
  it('returns routes from spec region', async () => {
    const areaId = '5db48620fa3f6812b6b670c5';
    const res = await request(app.callback())
      .get(`/region/${areaId}`)
      .expect(200);
    regionId = res.body[Math.floor(Math.random() * res.body.length)].id;
    console.log('TCL: regionId --->', regionId);
    const crags = await request(app.callback())
      .get(`/crag/${regionId}`)
      .expect(200);
    const random = Math.floor(Math.random() * crags.body.length);
    cragId = crags.body[random].id;
    console.log('TCL: cragId', cragId);
    const routes = await request(app.callback())
      .get(`/route/${cragId}`)
      .expect(200);
    console.log('TCL: routes', routes.body);
  });
});
