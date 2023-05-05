const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://39.107.119.92"); // 允许所有源站发起的跨域请求
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // 允许的 HTTP 请求方法
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // 允许的请求头
  next();
});

// 配置中间件
app.use(bodyParser.json());

// 创建 MySQL 数据库连接池
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "task",
});

// console.log('pool', pool);

// 获取数据
app.get("/getTasks", (req, res) => {
  pool.query("SELECT * FROM task", (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify(results));
  });
});

// 存入一条数据
app.post("/saveTasks", async (req, res) => {
  console.log("准备存入的数据", req.body);
  const list = JSON.parse(req.body);
  const { id, name, priority, duration, deadline } = list[0]; // 只存入一条数据

  // 删除表中所有数据
  pool.query(`DELETE FROM task`, (err, results) => {
    if (err) throw err;
    pool.query(
      `INSERT INTO task (id, name, priority, duration, deadline) VALUES ('${id}', '${name}', ${priority}, ${duration}, '${deadline}')`,
      (err, results) => {
        if (err) throw err;
        res.send("task added successfully");
      }
    );
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
