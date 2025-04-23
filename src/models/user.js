const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    address: String
});

const User = mongoose.model('user-blockchain', userSchema);

module.exports = User;
