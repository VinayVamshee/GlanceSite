const mongoose = require('mongoose');

// CommonCategory Schema
const commonCategorySchema = new mongoose.Schema({
    Name: {
        type: String,
    }
});


const CommonCategory = mongoose.model('CommonCategory', commonCategorySchema);

module.exports = CommonCategory;
