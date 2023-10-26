const mongoose = require('mongoose');
let {exerciseSchema} = require('./Exercise');

let exerciseLogSchema = mongoose.Schema({
    username: String,
    count: Number,
    log: [exerciseSchema]
})

module.exports = mongoose.model('ExerciseLog',exerciseLogSchema);