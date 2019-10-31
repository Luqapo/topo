const request = require('supertest');
const { expect } = require('chai');

const appInit = require('../../app');

let app;

describe('region route', () => {
  before(async () => {
    app = await appInit();
  });
  it.only('returns regions from spec area', async () => {
    const areaName = 'Sudety';
    await request(app.callback())
      .get(`/region/${areaName}`)
      .expect(200)
      .then((res) => {
        console.log('RESPONSE ->', res.body);
        expect(res.body).to.be.a('array');
      });
  });
});
