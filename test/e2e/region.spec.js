const request = require('supertest');
const { expect } = require('chai');

const appInit = require('../../app');

let app;

describe('region route', () => {
  let regionId;
  before(async () => {
    app = await appInit();
  });
  it.only('returns regions from spec area', async () => {
    const areaId = '5db48620fa3f6812b6b670c5';
    await request(app.callback())
      .get(`/region/${areaId}`)
      .expect(200)
      .then((res) => {
        console.log('RESPONSE ->', res.body);
        expect(res.body).to.be.a('array');
        regionId = res.body[Math.floor(Math.random() * res.body.length)].id;
        console.log('TCL: regionId', regionId);
      });
  });
  it.only('returns all info about one region', async () => {
    await request(app.callback())
      .get(`/region/one/${regionId}`)
      .expect(200)
      .then((res) => {
        console.log('RESPONSE ->', res.body);
        expect(res.body).to.be.a('object');
      });
  });
});
