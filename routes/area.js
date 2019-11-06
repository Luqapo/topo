const Router = require('koa-router');
const service = require('../service');
const { handleError } = require('../utils/error');

const router = new Router({ prefix: '/area' });

router.get('/', async (ctx, next) => {
  try {
    const areas = await service.area.getAll();
    ctx.body = areas;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

module.exports = router;
