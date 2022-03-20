const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Router } = require('express');
const router = express.Router();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1007',
    database : 'RNTest'
});

db.connect();
var sql = 'SELECT * FROM RNTest';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log("RESULT",result);
    });
    

    app.post('/', function (req, res) {
        let body = req.body;
        console.log("body",body)
        if (!body.userEmail) {
          res.status(400).send({
            message: "Content can not be empty!"
          });
          return;
        }
   
        const userInfo = {
          userName: body.userName,
          userPassword: body.userPassword,
          userEmail: body.userEmail,
          userAge: body.userAge,
        }
        var sql = 'INSERT INTO RNTest SET ?';
      
        db.query(sql, userInfo, (err, result)=>{
          if(err) {throw err;
            console.log("error",err)}
          console.log("result",result);
          res.send({
              status:'success',
          });
      });
      });
      

        app.get('/', function (req, res) {
       
        let body = req.query;
        const userEmail = body.userEmail
        const userPassword = body.userPassword
        const sql1 = 'SELECT COUNT(*) AS result FROM RNTest WHERE userEmail = ?'
        db.query(sql1, userEmail, (err, data) => {
            if(!err) {
               
                if(data[0].result < 1) {
                    res.status(500).send({
                        message: "student id is null"
                    });
                    
                    return;
                } else { // 동일한 id 가 있으면 비밀번호 일치 확인
                    const sql2 = `SELECT 
                                    CASE (SELECT COUNT(*) FROM RNTest WHERE userEmail = ? AND userPassword = ?)
                                        WHEN '0' THEN NULL
                                        ELSE (SELECT userEmail FROM RNTest WHERE userEmail = ? AND userPassword = ?)
                                    END AS userId
                                    , CASE (SELECT COUNT(*) FROM RNTest WHERE userEmail = ? AND userPassword = ?)
                                        WHEN '0' THEN NULL
                                        ELSE (SELECT userPassword FROM RNTest WHERE userEmail = ? AND userPassword = ?)
                                    END AS userPw`;
                    // sql 란에 필요한 parameter 값을 순서대로 기재
                    const params = [userEmail, userPassword, userEmail, userPassword, userEmail, userPassword, userEmail, userPassword]
                    db.query(sql2, params, (err, data) => {              
                        if(!err) {
                            res.send({
                                message: "Login success",
                                status:'success',
                                data:{
                                    userEmail:body.userEmail
                                }
                            });
                        } else {
                            res.send(err)
                        }
                    })
                }
            } else {
                res.send(err)
            }
        })
    })


app.listen(4000, ()=>{
    console.log('Server aktif di port ')
});