const mongoose = require('mongoose');

const CommonBackgroundSchema = new mongoose.Schema({
    backgroundImage: {
        type: String,
    }
});

module.exports = mongoose.model('CommonBackground', CommonBackgroundSchema);
