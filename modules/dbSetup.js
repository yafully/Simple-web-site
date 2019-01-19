'use strict'

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;//important否则会收到警告
// 连接mongodb
mongoose.connect('mongodb://localhost/test')
// 实例化连接对象
const db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误：'))
db.once('open', (callback) => {
  console.log('MongoDB连接成功！！')
})


module.exports = mongoose;