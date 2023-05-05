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
const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "task",
  })
  .promise();

// console.log('pool', pool);

// 获取数据
app.get("/getTasks", async (req, res) => {
  const [rows, fields] = await pool.query("SELECT * FROM task");
  console.log("getTasks_rsp", { rows, fields });
  // res.send(JSON.stringify(results));
});

// 存入一条数据
app.post("/saveTasks", async (req, res) => {
  console.log("准备存入的数据", req.body);
  console.log("准备存入的数据的类型", typeof req.body);
  const list = req.body;
  const { id, name, priority, duration, deadline } = list[0]; // 只存入一条数据

  // 删除表中所有数据
  const delete_rsp = await pool.query(`DELETE FROM task`);
  console.log("delete_rsp", delete_rsp);

  // 插入数据
  const insert_rsp = await pool.query(
    `INSERT INTO task (id, name, priority, duration, deadline) VALUES ('${id}', '${name}', ${priority}, ${duration}, '${deadline}')`
  );
  console.log("insert_rsp", insert_rsp);
});

// 启动服务器
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
