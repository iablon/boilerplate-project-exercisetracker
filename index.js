const express = require('express')
const app = express()
const bodyPasers = require('body-parser');
const cors = require('cors')
const User = require('./schemas/User')
const Exercise = require('./schemas/Exercise');
const ExerciseLog = require('./schemas/Log')
const mongoose = require('mongoose');

require('dotenv').config()



app.use(cors())
app.use(express.static('public'))
app.use(bodyPasers.urlencoded({extended: true}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users',async function(req,res){
  try {
    await mongoose.connect(process.env.MONGO_URI);
    if (await User.exists({username: req.body.username}).count() === 0){
      let createdUser = await new User({username: req.body.username}).save();
      let createUserLog = await new ExerciseLog({username: req.body.username,count: 0,_id: createdUser._id}).save();
      res.json({username: req.body.username,_id: createdUser._id})
    }
    else{
      res.json({error: "User exists"});
    }
  } catch (error) {
    console.log(error);
  }
})

app.get('/api/users',async function(req,res){
  try {
    await mongoose.connect(process.env.MONGO_URI);
    let UsersInDatabase = await User.find();
    res.json(UsersInDatabase);
  } catch (error) {
    console.log(error);
    res.json({error: "Database error"});
  }
})

app.post('/api/users/:_id/exercises',async function (req,res){
  let ussername;
  let newExercise;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.findById({_id: req.params._id}).then(user=>{ussername=user})
      newExercise = await new Exercise({
        username: ussername.username,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString()
      }).save();
      await ExerciseLog.findByIdAndUpdate(
        {
          _id: req.params._id
        },
        {
          $inc: {count: 1},
          $push: {
            log: {
              description: newExercise.description,
              duration: newExercise.duration,
              date: newExercise.date
            }
          }
        })
      res.json({
        username: ussername.username,
        description: req.body.description, 
        duration: parseInt(req.body.duration),
        date: newExercise.date,
        _id: req.params._id,
      })
    } catch (error) {
    console.log(error);
    res.json({error: error});
  }
});

app.get('/api/users/:_id/logs',async function(req,res){
  console.log(req.body.to);
  mongoose.connect(process.env.MONGO_URI)
  let exerLog = await ExerciseLog.findOne({_id: req.params._id}).exec();
  res.json(exerLog)
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
