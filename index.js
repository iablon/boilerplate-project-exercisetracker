const express = require('express')
const app = express()
const bodyPasers = require('body-parser');
const cors = require('cors')
const User = require('./schemas/User')
const {Exercise} = require('./schemas/Exercise');
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
  console.log(req.body.username);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    if (await User.exists({username: req.body.username}).count() === 0){
      let createdUser = await new User({username: req.body.username}).save();
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


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
