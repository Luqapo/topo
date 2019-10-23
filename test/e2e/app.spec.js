const request = require('supertest');
const { expect } = require('chai');

const appInit = require('../../app');

let app;

describe('app', () => {
  before(async () => {
    app = await appInit();
  });
  it('return 404', () => request(app.callback())
    .get('/')
    .expect(404)
    .then((res) => {
      console.log('RESPONSE ->', res.body);
      expect(res).to.be.a('object');
    }));
});
