const { expect } = require('chai');
const service = require('../../service');
const appInit = require('../../app');

describe('route service', () => {
  before(async () => {
    await appInit;
  });
  it('returns all routes from given crag', async () => {
    const routes = await service.route.get('5db48620fa3f6812b6b67443');
    console.log('TCL: crags', routes);
  });
});
