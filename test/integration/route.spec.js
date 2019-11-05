const { expect } = require('chai');
const service = require('../../service');
const appInit = require('../../app');

describe.only('route service', () => {
  before(async () => {
    await appInit;
  });
  it('returns all routes from given crag', async () => {
    const routes = await service.route.get('Grupa Knura');
    console.log('TCL: crags', routes);
  });
});
