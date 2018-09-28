const cp = require('child_process');
const mongoose = require('mongoose');
const { resolve } = require('path')
const News = require(resolve(__dirname, '../data/schema/news.js'));
const myNews = mongoose.model('News', News);
const fs = require('fs');

;(async () => {
  

  // 目标文件(爬虫文件)
  const script = require(resolve(__dirname, '../crawler/list.js'));

  // 创建子进程(要在子进程中运行的模块)
  const child = cp.fork(script, []);


  // 判断是否被执行过
  let invoked = false;

  child.on('error', err => {
    if (invoked) return;
    invoked = true;
    console.log(err);
  })

  // 子进程结束后会触发 'exit' 事件。 如果进程退出了，则 code 是进程的最终退出码，否则为 null。
  child.on('exit', code => {
    if (invoked) return;
    invoked = true;
    let err = code === 0 ? null : new Error('exit code' + code);
    console.log(err);
  })

  // 拿到数据
  child.on('message', data => {
    let result = data.result;

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
  });
})();
