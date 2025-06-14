const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneno: {type: Number},
    backgroundImage: { // New field for user-specific background
        type: String,
        default: '' // Default value can be an empty string or a default background image URL
    }

});

module.exports = mongoose.model('User', UserSchema);
