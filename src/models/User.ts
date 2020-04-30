const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  node_id: {
    type: String,
    required: true,
    unique: true
  },
  login: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  html_url: {
    type: String
  },
  avatar_url: {
    type: String
  },
  projects: [mongoose.ObjectId],
});

module.exports = mongoose.model('User', UserSchema);
