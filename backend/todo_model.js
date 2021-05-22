const mongoose = require('mongoose')

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        require: true,
    },
    accomplished: {
        type: Boolean,
        default: false,
    },
    accomplishedAt: {
        type: Date,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
})

module.export = {Todo}