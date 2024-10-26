const mongoose = require('mongoose');

const CommonSiteSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends
    },
    Url: {
        type: String,
        required: true,
        unique: true, // Ensure each URL is unique
        trim: true
    },
    Logo: {
        type: String,
        required: true,
        trim: true
    },
    Category: {
        type: String,
        required: true,
        trim: true
    }
});

// Create the model
const CommonSite = mongoose.model('CommonSite', CommonSiteSchema);

module.exports = CommonSite;
