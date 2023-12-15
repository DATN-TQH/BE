const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require("./db");
const port = process.env.PORT || 8000;
const app = express();

app.use(cors());

const con = db();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app
  .route("/products")
  .get(function (req, res) {
    let sql = "SELECT * FROM product";
    con.query(sql, (err, response) => {
      if (err) {
        res.send({ status: "error", message: err });
      } else {
        res.send({ status: "success", data: response });
      }
    });
  })
  .post(function (req, res) {
    let sql = "insert into product set ?";
    const { body } = req;
    con.query(sql, body, function (err, response) {
      if (err) {
        res.send({ status: "error", message: err });
      } else {
        res.send({
          status: "success",
          data: { ...body, id: response.insertId },
        });
      }
    });
  });
app.route("/hot-products").get(function (req, res) {
  let sql = "SELECT * FROM product limit 8";
  con.query(sql, (err, response) => {
    if (err) {
      res.send({ status: "error", message: err });
    } else {
      res.send({ status: "success", data: response });
    }
  });
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
