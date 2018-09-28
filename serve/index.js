const Koa = require('koa');
const app = new Koa();

// 模板引擎
const views = require('koa-views');
const {resolve} = require('path');
const {connect, initSchemas} = require('./database/connet.js');

// 激活router
const router = require('./routes');

// 连接数据库
;(async () => {
  await connect()
  // 初始化Schema 
  initSchemas();

  // 爬取列表
  require(resolve(__dirname, './crawler/list'));

})();

// 使用koa-views
app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'  // 扩展名是pug都被识别
}))

// app.use(async (ctx, next) => {
//   // pug的render方法被挂载到上下文了
//   await ctx.render('index', {
//     you: 'Luck',
//      me: 'xx'
//   })
// });

// 使用router
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8888)
