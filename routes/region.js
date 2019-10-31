const Router = require('koa-router');
const service = require('../service');

const router = new Router({ prefix: '/region' });

router.get('/:areaName', async (ctx, next) => {
  const { areaName } = ctx.params;
  console.log('TCL: areaName', areaName);
  try {
    const areas = await service.region.get(areaName);
    ctx.body = areas;
  } catch(err) {
    console.error(err.message);
    ctx.status(400);
    ctx.body = err.message;
  }
  next();
});

module.exports = router;
