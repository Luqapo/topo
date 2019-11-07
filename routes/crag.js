const Router = require('koa-router');
const service = require('../service');
const { handleError } = require('../utils/error');

const router = new Router({ prefix: '/crag' });

router.get('/:regionId', async (ctx, next) => {
  const { regionId } = ctx.params;
  try {
    const regions = await service.crag.get(regionId);
    ctx.body = regions;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

module.exports = router;
