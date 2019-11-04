const { expect } = require('chai');
const service = require('../../service');
const appInit = require('../../app');

describe('sector service', () => {
  let sectorId;
  before(async () => {
    await appInit;
  });
  it('returns all regions from given area', async () => {
    const region = await service.region.getOne('5db48620fa3f6812b6b6747c');
    const sectors = await service.sector.get(region.name);
    console.log('TCL: sectors', sectors);
    sectorId = sectors[1].id;
  });
  it('returns sector', async () => {
    const sector = await service.sector.getOne(sectorId);
    console.log('TCL: sector', sector);
  });
});
