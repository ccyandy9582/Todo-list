const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{value} is not a email address'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 8
    }
})

userSchema.pre('save', (next) => {
    var user = this
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else 
        next()
})

userSchemas.statis.login = (email, password) => {
    var user = this
    return user.findOne({email}).then((user) => {
        if (user) {
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) resolve(user)
                    else reject()
                })
            })
        } else {
            return Promise.reject()
        }
    })
}

var user = mongoose.model('user', userSchema)

module.exports = {user}