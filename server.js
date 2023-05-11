const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://39.107.119.92"); // 允许所有源站发起的跨域请求
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // 允许的 HTTP 请求方法
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // 允许的请求头
  next();
});

// 配置中间件
app.use(bodyParser.json());

// 创建 MySQL 数据库连接池
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Aliyun2023!@#",
  database: "task",
});

// 获取数据
app.get("/getWork", (req, res) => {
  console.log("server getWork");
  pool.getConnection((err, connection) => {
    connection.query("SELECT * FROM work", (err, results) => {
      console.log("server getWork 回调", results);
      res.send(JSON.stringify(results));
      connection.release();
    });
  });
});

// 存入一条数据
app.post("/saveWork", async (req, res) => {
  const list = req.body;
  const values = list.map((v) => {
    const { id, name, priority, duration, deadline } = v;
    return [id, name, priority, duration, deadline];
  });

  pool.getConnection((err, connection) => {
    // 删除表中所有数据
    connection.query(`DELETE FROM work`, (err, result) => {
      console.log("删除数据成功后，准备插入的数据", values);

      if (values.length === 0) return;

      // 插入数据
      try {
        connection.query(
          `INSERT INTO work (id, name, priority, duration, deadline) 
      VALUES ?`,
          [values],
          (err, result) => {
            console.log("插入数据后的回调 err", err);
            connection.release();
            res.status(200).send();
          }
        );
      } catch (error) {
        console.log("插入数据报错", JSON.stringify(error));
        connection.release();
      }
    });
  });
});



// 获取数据
app.get("/getLife", (req, res) => {
  console.log("server getLife");
  pool.getConnection((err, connection) => {
    connection.query("SELECT * FROM life", (err, results) => {
      console.log("server getLife 回调", results);
      res.send(JSON.stringify(results));
      connection.release();
    });
  });
});

// 存入一条数据
app.post("/saveLife", async (req, res) => {
  const list = req.body;
  const values = list.map((v) => {
    const { id, name, priority, duration, deadline } = v;
    return [id, name, priority, duration, deadline];
  });

  pool.getConnection((err, connection) => {
    // 删除表中所有数据
    connection.query(`DELETE FROM life`, (err, result) => {
      console.log("删除数据成功后，准备插入的数据", values);

      if (values.length === 0) return;

      // 插入数据
      try {
        connection.query(
          `INSERT INTO life (id, name, priority, duration, deadline) 
      VALUES ?`,
          [values],
          (err, result) => {
            console.log("插入数据后的回调 err", err);
            connection.release();
            res.status(200).send();
          }
        );
      } catch (error) {
        console.log("插入数据报错", JSON.stringify(error));
        connection.release();
      }
    });
  });
});


// 启动服务器
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
