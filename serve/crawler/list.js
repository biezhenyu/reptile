const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const { resolve } = require('path')
const News = require(resolve(__dirname, '../data/schema/news.js'));
const myNews = mongoose.model('News', News);
const fs = require('fs');

// 等待3000秒
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time);
})

// 爬去地址
const url = 'https://www.jianshu.com/';

;(async () => {
  console.log('start visit');

  // 启动一个浏览器
  const brower = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  });

  // 用浏览器启动一个页面
  const page = await brower.newPage();

  // 爬取页面
  await page.goto(url, {
    waitUntil: 'networkidle2'  // 网络空闲说明已加载完毕
  });

  await sleep(3000);

  // 拿到结果
  const result = await page.evaluate(() => {
    let $ = window.$;
    let items = $('.note-list .have-img');
    let links = []
    if (items.length > 1) {
      items.each((index, item) => {
        let it = $(item)
        let name = it.find('.title').text();
        let content = it.find('.abstract').text().replace(/^\s+|\s+$/g,'');
        let authorName= it.find('.nickname').text();
        let id = index + Math.random();

        links.push({
          id,
          name,
          content,
          authorName
        })
      }) 
    }
    return links
  });


  // 关闭浏览器
  brower.close();

  // 写入文件
  fs.writeFile(resolve(__dirname, '../data/data.json'), JSON.stringify({list: result}), {
    encoding: 'utf8'
  }, (err) => {
    if (err) throw err;
  });

  // 存入数据库
  result.forEach(async (item, index) => {
    news = new myNews(item);
    await news.save()
  })

  console.log('爬虫结束');
})();