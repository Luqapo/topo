const { expect } = require('chai');
const service = require('../../service');
const appInit = require('../../app');


describe('area service', () => {
  before(async () => {
    await appInit;
  });
  it.only('returns all areas', async () => {
    const areas = await service.area.getAll();
    console.log('TCL: areas', areas);
    expect(areas.length).to.equal(2);
    areas.forEach((a) => {
      expect(a.name).to.be.a('string');
      expect(Array.isArray(a.coordinates)).to.equal(true);
      expect(a.coordinates[0]).to.be.a('number');
      expect(a.coordinates[1]).to.be.a('number');
    });
  });
});
