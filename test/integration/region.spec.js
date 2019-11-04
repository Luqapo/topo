const { expect } = require('chai');
const service = require('../../service');
const appInit = require('../../app');

describe('region service', () => {
  before(async () => {
    await appInit;
  });
  it('returns all regions from given area', async () => {
    const areaId = (await service.area.getAll())[0].id;
    console.log('TCL: areaName', areaId);
    const regions = await service.region.get(areaId);
    console.log('TCL: regions', regions);
  });
});
