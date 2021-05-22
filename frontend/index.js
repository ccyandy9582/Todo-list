const express = require('express')
const {ObjectId} = require('mongodb')
const { mongoose } = require('./mogoose')
const {Todo} = require('./todo_model')
const {User} = require('./user_model')
const bodyParser = require('body-parser')
const _ = require('lodash')

var app = express()
const port  = process.env.PORT || 9999

app.use(bodyParser.json())

//create user
app.post('/user/create', async(req, res) => {
    try {
        var body = _.pick(req.body, ['email', 'password'])
        var user = new User(body)
        await user.save()
    } catch (error) {
        res.status(400).send()
    }
})

//login
app.post('/user/login', async (req, res) => {
    try {
        var body = _.pick(req.body, ['email', 'passowrd'])
        var user = await User.login(body.email, body.passowrd)
    } catch (error) {
        res.status(400).send(error)
    }
})

// get the todo list of the user
app.get('/todo/:id', (req, res) => {
    var id = req.params.id

    if (ObjectId.isValid(id)) {
        Todo.findOne({
            _id: id,
            _creator: req.user.id
        }).then((todo) => {
            if (todo) {
                res.send({todo})
            } else {return res.status(404).send()}
        }).catch((err) => {
            res.status(400).send(err)
        })
    } else {res.status(404).send()}
})

//create new todo task
app.post('/todo', (req, res) => {
    var todo = new Todo({
        text:req.body.text,
        _creator: req.user.id
    })

    todo.save().then( (result) =>{
        res.send(result)
    }, (err) => {
        res.status(400).send(err)
    })
})

//update the task
app.patch('/todo/:id', (req, res) => {
    var id = req.params.id
    // to select the text and accomplished object from the html body
    var body = _.pick(req.body, ['text', 'accomplished'])

    if (ObjectId.isValid(id)) {
        if (_.isBoolean(body.accomplished)) {
            body.accomplishedAt = new Date().getTime();
        } else {
            body.accomplished = false;
            body.accomplishedAt = null;
        }
        //findOneAndUpdate(find who, update what, and allow new record)
        Todo.findOneAndUpdate({_id: id, _creator: req.user.id}, {$set:body}, {new: true}).then((result) => {
            if(result) {
                res.send({result})
            } else {
                res.status(404).send(err)  // cannot find the 'one' to update
            }
        }).catch(() => {
            res.status(400).send()
        })
    } else {
        res.status(404).send()  // cannot find the user
    }
})

//delete the task
app.delete('./todo/:id', async (req, res) => {
    var id = req.params.id

    if (ObjectId.isValid(id)) {
        try {
            //findOneAndDelete(find who)
            //for more information, you should use findOneAndDelete() unless you have a good reason to use findOneAndRemove()
            var todo = await Todo.findOneAndDelete({_id:id, _creator: req.body._id})
            if (todo) {
                res.send({todo})
            } else {
                return res.status(404).send()
            }
        } catch (error) {
            res.status(400).send()
        }
    } else {
        res.status(404).send()
    }
})

app.listen(port, () => {
    console.log(`The app is now on port: ${port}`);
})

module.export = { app }  