const express = require('express');
const app = express();
const cors = require('cors');
const moment = require('moment');
require('dotenv').config();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true} ));

let mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.connect(process.env.MONGO_URI)

const UserSchema = new mongoose.Schema({
  username: String
})

let user = mongoose.model('User', UserSchema);

const SessionSchema = new mongoose.Schema({
  user_id: String,
  description: String,
  duration: Number,
  date: Date
});

let session = mongoose.model('Session', SessionSchema)

app.post('/api/users', async (req, res) => {
  await user.create({
    username: req.body.username
  }) 
  user.findOne({'username': req.body.username})
  .exec()
  .then( (doc) => {
    res.json({
      username: doc.username,
      _id: doc._id
    });
  }) 
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const id = req.params._id;
  const username = await user.findById(id);
  const desc = req.body.description;
  const dur = parseInt(req.body.duration);
  var date = req.body.date ? new Date(req.body.date) : new Date();

  function addHours(date, hours) {
    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date;
  }

  date = addHours(date, 6);

  var exercise = await session.create({
    user_id: id,
    description: desc,
    duration: dur,
    date: date
  })

var exObject = {
  _id: username._id, 
  username: username.username,
  description: exercise.description,
  duration: exercise.duration, 
  date: new Date(date).toDateString()
}

res.json(exObject);

});

app.get('/api/users', (req, res) => {
  user.find()
  .then((doc) => {
    res.send(doc);
  })
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/currentUser/:username', (req, res) => {
  user.findOne({ username: req.params.username}, '_id')
  .exec()
  .then( (doc) => {
    res.send(doc._id.toString());
  })
})

app.get('/api/users/:_id/logs', async (req, res) => {
  const id = req.params._id;
  const curUser = await user.findById( id );
  var { from, to, limit } = req.query;
  
  var exercises = []
  if (!from) {
    from = '0000-00-00';
  }
  if (!to) {
    to = '9999-12-31';
  }
  if (!limit) {
    limit = 1000;
  }

  var getExercises = session.find({user_id: id/*,  date: {$gte: new Date(from), $lte: new Date(to)}*/}, {user_id: 0, _id: 0, __v: 0 }).limit(limit);
  exercises = await getExercises.exec();

  const log = exercises.map(e => ({
    description : e.description,
    duration : e.duration,
    date: e.date.toDateString()
  }));

  responseObject = {
    _id: curUser._id,
    username: curUser.username,
    count: exercises.length,
    log
  };

  res.json(responseObject);
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
