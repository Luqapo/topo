const Koa = require('koa');

const app = new Koa();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listen on ${PORT}`);
});
