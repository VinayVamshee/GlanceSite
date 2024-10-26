const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now } // Auto-fills with the current date/time
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
