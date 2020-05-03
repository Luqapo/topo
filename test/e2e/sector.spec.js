const request = require('supertest');
const { expect } = require('chai');

const appInit = require('../../app');

let app;

describe.only('sector route', () => {
  let regionId;
  before(async () => {
    app = await appInit();
  });
  it('returns sector', async () => {
    const sectorId = '5db48620fa3f6812b6b674a5';
    const res = await request(app.callback())
      .get(`/sector/${sectorId}`)
      .expect(200);
    console.log('SECTOR ->', res.body);
  });
});
