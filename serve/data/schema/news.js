const mongoose = require('mongoose');

// Schema进行数据架构的定义
const Schema = mongoose.Schema;

// Mixed里面存储任何类型的数据，存取变化比较频繁的数据
const { Mixed, ObjectId} = Schema.Types;

newsSchema = new Schema({
  id: {
    unique: true,
    type: Number
  },
  name: String,
  content: String,
  authorName: String
});

// 让中间键继续往下调用
newsSchema.pre('save', function(next) {
  next();
});

// 通过mongoose将模型发送出去
mongoose.model('News', newsSchema);

module.exports = newsSchema;
