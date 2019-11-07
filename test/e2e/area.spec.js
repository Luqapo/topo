const request = require('supertest');
const { expect } = require('chai');

const appInit = require('../../app');

let app;

describe('area route', () => {
  before(async () => {
    app = await appInit();
  });
  it('returns areas', async () => {
    await request(app.callback())
      .get('/area')
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.equal(2);
      });
  });
  it('returns 404 when invalid url passed', async () => {
    const res = await request(app.callback())
      .get('/areaW')
      .expect(404);
    expect(res.body.error).to.equal('Page not found');
  });
});
