const Router = require('koa-router');
const service = require('../service');
const { handleError } = require('../utils/error');

const router = new Router({ prefix: '/sector' });

router.get('/:sectorId', async (ctx, next) => {
  const { sectorId } = ctx.params;
  console.log('TCL: sectorId', sectorId);
  try {
    const sector = await service.sector.get(sectorId);
    console.log('TCL: sector', sector);
    ctx.body = sector;
  } catch(err) {
    handleError(ctx, err);
  }
  next();
});

module.exports = router;
