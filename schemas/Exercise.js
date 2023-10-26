const mongoose = require('mongoose');

let exerciseSchema = mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date
});

const Exercise = mongoose.model('Exercise',exerciseSchema);

module.exports = {
    Exercise,
    exerciseSchema
}
