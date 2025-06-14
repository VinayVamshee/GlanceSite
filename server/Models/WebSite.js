const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Url: {
        type: String,
        required: true,
    },
    Logo: {
        type: String,
        required: true,
    },
    Category: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    }
});

module.exports = mongoose.model('Site', SiteSchema);
