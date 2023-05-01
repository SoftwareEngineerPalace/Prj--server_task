const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

// 配置中间件
app.use(bodyParser.json());

app.use(cors({origin: 'http://39.107.119.92/', methods: ['GET', 'POST'], credentials: true}));

// 创建 MySQL 数据库连接池
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "task",
});

console.log('pool', pool);

// 获取数据
app.get("/getTasks", (req, res) => {
  pool.query("SELECT * FROM task", (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// 存入一条数据
app.post("/updateTasks", async (req, res) => {
  const { id, name, priority, duration, deadline } = req.body.list[0]; // 只存入一条数据

  // 删除表中所有数据
  pool.query(`DELETE FROM tasks`, (err, results) => {
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
