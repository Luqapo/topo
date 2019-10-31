const Router = require('koa-router');
const service = require('../service');

const router = new Router({ prefix: '/region' });

router.get('/:areaId', async (ctx, next) => {
  const { areaId } = ctx.params;
  console.log('TCL: areaName', areaId);
  try {
    const regions = await service.region.get(areaId);
    ctx.body = regions;
  } catch(err) {
    console.error(err.message);
    ctx.status =400;
    ctx.body = err.message;
  }
  next();
});

router.get('/one/:regionId', async (ctx, next) => {
  const { regionId } = ctx.params;
  try {
    const region = await service.region.getOne(regionId);
    ctx.body = region;
  } catch(err) {
    console.error(err.message);
    ctx.status = 400;
    ctx.body = err.message;
  }
});

module.exports = router;
