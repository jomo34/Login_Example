var crypto = require('crypto');
const express = require('express');
const router = express.Router();

//Login
router.post('/', async function (req, res, next) {
    let body = req.body;

    if(!body.userEmail){
        res.status(500).send({
            message: "student id is null"
        });
        return;
    }

    let result = await findOne({
        where: {
            userEmail: body.userEmail
        }
    });

    let dbPassword = result.dataValues.userPassword;
    let inputPassword = body.userPassword;

    if (dbPassword === inputPassword) {
        res.send({
            message: "Login success",
            status:'success',
            data:{
                userEmail:body.userEmail
            }
        });
    }
    else {
        res.status(500).send({
            message: "Wrong Password"
        });
    }
})

module.exports = router;