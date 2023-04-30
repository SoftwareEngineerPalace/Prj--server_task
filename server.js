const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// 配置中间件
app.use(bodyParser.json());
app.use(cors());

// 创建 MySQL 数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'mydatabase'
});

// 处理 GET 请求
app.get('/items', (req, res) => {
  pool.query('SELECT * FROM items', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// 处理 POST 请求
app.post('/items', (req, res) => {
  const { name, description } = req.body;

  pool.query(
    `INSERT INTO items (name, description) VALUES ('${name}', '${description}')`,
    (err, results) => {
      if (err) throw err;
      res.send('Item added successfully');
    }
  );
});

// 启动服务器
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
