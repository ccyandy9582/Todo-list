const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect("mongodb://127.0.0.1:27017/", {
    useNewUrlParser: true,  //the url is the old format and it will be given up in the future version, so this parser convert the old format to the new format
    useUnifiedTopology: true,
    useCreateIndex: true
})
console.log("connected");

module.exports = { mongoose }