const Router = require('koa-router');
const service = require('../service');

const router = new Router({ prefix: '/area' });

router.get('/', async (ctx, next) => {
  try {
    const areas = await service.area.getAll();
    ctx.body = areas;
  } catch(err) {
    console.error(err.message);
    ctx.status(400);
    ctx.body = err.message;
  }
});

module.exports = router;
