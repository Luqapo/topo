const { expect } = require('chai');
const service = require('../../service');
const appInit = require('../../app');

describe('region service', () => {
  before(async () => {
    await appInit;
  });
  it('returns all regions from given area', async () => {
    const areaName = (await service.area.getAll())[0].name;
    console.log('TCL: areaName', areaName);
    const regions = await service.region.get(areaName);
    console.log('TCL: regions', regions);
  });
});
