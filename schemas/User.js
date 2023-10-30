const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }
});

//UserSchema.pre('save', () => console.log('Hello from pre save'));


module.exports = mongoose.model('User',UserSchema);