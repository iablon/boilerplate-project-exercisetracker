const mongoose = require('mongoose');

let exerciseSubSchema = new mongoose.Schema({
    description: String,
    duration: Number,
    date: String
},{_id: false});

let exerciseLogSchema = new mongoose.Schema({
    username: String,
    count: Number,
    log: [exerciseSubSchema]
})

module.exports = mongoose.model('ExerciseLog',exerciseLogSchema);