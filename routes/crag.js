const Router = require('koa-router');
const service = require('../service');
const { handleError } = require('../utils/error');

const router = new Router({ prefix: '/crag' });

router.get('/:cragId', async (ctx, next) => {
  const { cragId } = ctx.params;
  try {
    const regions = await service.crag.getOne(cragId);
    ctx.body = regions;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

module.exports = router;
