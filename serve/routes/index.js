const Router = require('koa-router');
const mongoose = require('mongoose');

const router = new Router();

// 拿到所有数据
router.get('/list', async(ctx, next) => {
  const News = mongoose.model('News');
  const news = await News.find({});

  // ctx.body = {
  //   news
  // }
  await ctx.render('list', {list: news});
  next();
})

module.exports = router;
