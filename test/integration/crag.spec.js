const { expect } = require('chai');
const service = require('../../service');
const appInit = require('../../app');

describe('crag service', () => {
  before(async () => {
    await appInit;
  });
  it('returns all crags from given region', async () => {
    const crags = await service.crag.get('5db48620fa3f6812b6b67482');
    console.log('TCL: crags', crags);
  });
});
