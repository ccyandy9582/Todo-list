const { method } = require('bluebird');
const bodyParser = require('body-parser');
const express = require('express');
const { url } = require('is');
const router = express.Router()
const request = require('request')

/* GET home page. */
router.get('/', function(req, res, next) {
    var accomplishedList = []
    var continueList = []
    var email = req.cookies['email']

    if (req.cookies['login'] == undefined)
        res.cookie('login', false)

    var login = req.cookies['login']

    if (login) {
        request.get(`http://localhost:9999/todo/user/${email}`, (err, results) => {
            if (err) res.status(400).send()
            if (results.statusCode == 200) {
                let list = JSON.parse(results.toJSON().body)
                list.forEach(todo => {
                    if (todo.accomplished == 0)
                        accomplishedList.push(todo)
                    else
                        continueList.push(todo)
                })
                res.render('index', {login: req.cookies['login'], accomplishedList, continueList})
            } else {
                res.status(400).send()
            }
        })
    } else {
        res.render('index', {login, accomplishedList, continueList})
    }
})

router.post('/addtask', (req, res) => {
    var email = req.cookies['email']
    var content = req.body.todoText

    var newTaskOption = {
        uri: "http://localhost:9999/todo/create",
        body: `{"email": "${email}", "content": "${content}"}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    request(newTaskOption, (err, response) => {
        console.log(err, response);
    })
    res.redirect("/")
})

router.get('/todo/delete/:id', (req, res) => {
    var id = req.params.id

    const options = {
        url: `http://localhost:9999/todo/delete/${id}`,
        method: "DELETE"
    }

    request(options, (err, res, body) => {
        if (err) err
        console.log(`Status: ${res.statusCode}`);
    });
    res.redirect("/")
})

router.get('/todo/done/:id', (req, res) => {
    var id = req.params.id

    request.get(`http://localhost:9999/todo/task/${id}`, (err, result) => {
        if (err) throw err
        if (result.statusCode == 200) {
            let jsonResult = JSON.parse(result.body)[0]
            console.log(jsonResult);

            const options = {
                url: `http://localhost:9999/todo/update/${id}`,
                method: "PATCH",
                body: `{"content": "${jsonResult.content}", "accomplished": 1}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            request(options, (err, res, body) => {
                if (err) throw err
                if (res.statusCode == 200) {
                    console.log(body);
                }
            })
        }
    })
    res.redirect('/')
})

module.exports = router;