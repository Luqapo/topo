const { expect } = require('chai');
const service = require('../../service');
const appInit = require('../../app');

describe.only('crag service', () => {
  before(async () => {
    await appInit;
  });
  it('returns all crags from given region', async () => {
    const crags = await service.crag.get('Łutowiec');
    console.log('TCL: crags', crags);
  });
});
