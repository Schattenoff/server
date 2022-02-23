const {Schema, model} = require('mongoose');

const User = new Schema({
    username: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    events: {type: Array},
});

module.exports = model('User', User);