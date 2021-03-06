const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const dbInit = require('./db/db');
const router = require('./routes');
const service = require('./service');
const scopes = require('./utils/scopes');

const PORT = process.env.PORT || 3000;
let appPromise;

const app = new Koa();

app.use(cors());

app.use(bodyParser({
  enableTypes: ['json'],
}));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch(err) {
    // eslint-disable-next-line no-console
    console.error(err);
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { error: err.message };
  }
});

app.use(service.auth.middleware(scopes));

app.use(router());

function init() {
  if(!appPromise) {
    // eslint-disable-next-line no-async-promise-executor
    appPromise = new Promise(async (resolve) => {
      await dbInit;
      await service.planer.getRoute();
      app.listen(PORT, () => {
        console.log(`Server runing in ${process.env.NODE_ENV} and listen on ${PORT}`);
        resolve(app);
      });
    });
  }
  return appPromise;
}

init();

module.exports = init;
