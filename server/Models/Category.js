const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
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

module.exports = mongoose.model('Category', CategorySchema);
