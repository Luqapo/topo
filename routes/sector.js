const Router = require('koa-router');
const service = require('../service');
const { handleError } = require('../utils/error');

const router = new Router({ prefix: '/sector' });

router.get('/:regionId', async (ctx, next) => {
  const { regionId } = ctx.params;
  try {
    const sectors = await service.sector.get(regionId);
    ctx.body = sectors;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

module.exports = router;
