const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    phnNumber: Number,
}, { collection: 'UserCollection'})

var modelSchema = mongoose.model('User', userSchema)
module.exports = modelSchema;