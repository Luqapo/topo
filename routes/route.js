const Router = require('koa-router');
const service = require('../service');
const { handleError } = require('../utils/error');

const router = new Router({ prefix: '/route' });

router.get('/:cragId', async (ctx, next) => {
  const { cragId } = ctx.params;
  console.log('TCL: cragId', cragId);
  try {
    const regions = await service.route.get(cragId);
    ctx.body = regions;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

module.exports = router;
