const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const request = require('request')
const { array } = require('is')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', {login: false})
});

router.post('/', urlencodedParser, [
    check('email', 'Please input your email.')
        .exists()
        .isEmail()
        .normalizeEmail(),
    check('password', 'Please input your password.')
        .exists()
        .isLength({min: 8})
] ,(req, res) => {
    var errors = validationResult(req)
    if(errors.errors.length > 0) {
        let alert = errors.array()
        res.render('login', {alert, login:false})
    } else {
        var newUserOption = {
            uri: "http://localhost:9999/user/login",
            body: `{"email": "${req.body.email}", "password": "${req.body.password}"}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        request(newUserOption, (err, response) => {
            if (err) throw err
            if (response.statusCode == 200) {
                res.cookie('login', true)
                res.cookie('email', req.body.email)
                res.redirect('/')
            } else {
                let alert = [{msg: "login failed, please try again"}]
                res.render('login', {alert, login: false})
            }
        })
    }
})

module.exports = router;