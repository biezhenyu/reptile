const mongoose = require('mongoose');
const db = 'mongodb://localhost/jianshu';
const glob = require('glob');
const { resolve } = require('path')

mongoose.Promise = global.Promise;

exports.initSchemas = () => {
  // 同步加载所有的文件
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require);
}

exports.connect = () => {
  if (process.env.NODE_ENV !== 'production') {  // 生产环境开启debug
    mongoose.set('debug', true);
  }

  // 设置最大连接次数
  let maxConnectTimes = 0;

  return new Promise((resolve,reject) => {
    mongoose.connect(db);

    // 处理未连接
    mongoose.connection.on('disconnected', (error) => {
      maxConnectTimes ++;
      if (maxConnectTimes < 5) {
        mongoose.connect(db);
      } else {
        throw new Error('数据库挂了')
      }
    });

    // 连接失败
    mongoose.connection.on('error', (err) => {
      maxConnectTimes ++
      if (maxConnectTimes < 5) {
          mongoose.connect(db)
      } else {
          reject(err)
      }
    });

    // 数据库连接上
    mongoose.connection.once('open', () => {
      resolve()
      console.log('mongodb 连接')
    });
  })
}

