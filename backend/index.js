const express = require('express')
const {ObjectId} = require('mongodb')
const mysql = require('./mysql')
const bodyParser = require('body-parser')

var app = express()
const port  = process.env.PORT || 9999

app.use(bodyParser.json())
app.use(bodyParser.raw())

//create user
app.post('/user/create', async(req, res) => {
    try {
        let email = req.body.email
        let password = req.body.password
        mysql.query("insert into users(email, password) values(?, ?)", [email, password], (err, results) => {
            if (err) throw err
            res.status(200).send(results)
        })
    } catch (error) {
        res.status(400).send()
    }
})

//login
app.post('/user/login', async (req, res) => {
    try {
        let email = req.body.email
        let password = req.body.password
        mysql.query("select * from users where email = ? and password = ?", [email, password], (err, results) => {
            if (err) throw err
            if (results.length > 0) {
                res.send(results)
            } else {
                res.status(404).send(results)
            }
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

// get the todo list of the user
app.get('/todo/user/:email', (req, res) => {
    var email = req.params.email
    mysql.query("select * from todo where createBy = ?", [email], (err, results) => {
        if (err) res.status(400).send(err)
        res.status(200).json(results)
    })
})

//get the todo item by id
app.get('/todo/task/:id', (req, res) => {
    var id = parseInt(req.params.id)
    mysql.query("select * from todo where id = ?", [id], (err, result) => {
        if (err) res.status(400).send(err)
        res.status(200).send(result)
    })
})

//create new todo task
app.post('/todo/create', (req, res) => {
    try {
        let email = req.body.email
        let content = req.body.content

        if (email == null ) {
            res.status(400).send("please provide an id or an email")
        } else {
            mysql.query("insert into todo(createBy, content) values(?, ?)", [email, content], (err, result) => {
                if (err) throw err
                res.status(200).send(result)
            })
        }
    } catch (error) {
        res.status(400).send(error)
    }    
})

//update the task
app.patch('/todo/update/:id', (req, res) => {
    var id = req.params.id
    // to select the text and accomplished object from the html body
    var content = req.body.content
    var accomplished = req.body.accomplished
    var accomplishedAt = null

    if (accomplished == 1) 
        accomplishedAt = new Date()

    console.log(`id: ${id}, content: ${content}, accomplished: ${accomplished}accomplishedAt: ${accomplishedAt}`)

    mysql.query("update todo set content = ?, accomplished = ?, accomplishedAt = ? where id = ?", [content, accomplished, accomplishedAt, id], (err, results) => {
        if (err) throw err
        res.send(results)
    })
})

//delete the task
app.delete('/todo/delete/:id', (req, res) => {
    console.log("hi");
    var id = req.params.id
    mysql.query("delete from todo where id = ?", [id], (err, results) => {
        if (err) throw err
        res.status(200).json(results)
    })
})

app.listen(port, () => {
    console.log(`The app is now on port: ${port}`);
})

module.export = { app }  