const mongoose = require('mongoose');

const lockedUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('LockedUser', lockedUserSchema);
