const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
const bodyParser = require('body-parser')
const _ = require('lodash')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const request = require('request')
const { array } = require('is')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('signup', {login: false})
});

router.post('/create', urlencodedParser, [
    check('email', 'You are require to inpit an email address.')
        .exists()
        .isEmail()
        .normalizeEmail(),
    check('password', 'You are require to provide a password which at least 8 digits.')
        .exists()
        .isLength({min: 8})
] ,(req, res) => {
    var errors = validationResult(req)
    var email = req.body.email
    var password = req.body.password
    var conPassword = req.body.conPassword

    if (password != conPassword || !errors.isEmpty()) {
        let alert = errors.array()
        if (password != conPassword) alert.push({msg: "Please make sure both password same."})
        res.render('signup', {alert, login: false})
    } else {
        var newUserOption = {
            uri: "http://localhost:9999/user/create",
            body: `{"email": "${email}", "password": "${password}"}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var success = request(newUserOption, (err, response) => {
            console.log(err, response);
            return err
        })
        console.log("success: "+ typeof success);
        if (!success) {
            let alert = array()
            alert.push({msg: "register failed, please try it later"})
            res.render('signup', {alert, login: false})
        } else {
            res.cookie('email', email)
            res.cookie('login', true)
            res.render('index', {login: true})
        }
    }
})

module.exports = router;