const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true} ))

let mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI)

const UserSchema = new mongoose.Schema({
  'username': String
})

let user = mongoose.model('User', UserSchema);

const SessionSchema = new mongoose.Schema({
  'user_id': Object,
  'description': String,
  'duration': Number,
  'date': Date
});

let session = mongoose.model('Session', SessionSchema)

app.post('/api/users', (req, res) => {
  user.create({
    username: req.body.username
  }) 
  user.findOne({'username': req.body.username})
  .exec()
  .then( (doc) => {
    console.log(doc);
    res.json({
      'username': doc.username,
      '_id': doc._id
    });
  }) 
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const userid = req.params._id;
  const desc = req.body.description;
  const dur = req.body.duration;
  var date = Date();
  var todaysDate = new Date(date).toDateString();
  var exdate = new Date(req.body.date).toDateString();
  if (exdate == "Invalid Date") {
    exdate = todaysDate;
  }
  console.log(exdate);
  session.create({
    user_id: userid,
    description: desc,
    duration: dur,
    date: exdate
  })
  user.findOne({'_id': userid})
  .exec()
  .then( (doc) => {
    res.json({
      '_id': userid,
      'username': doc.username,
      'date': exdate,
      'duration': dur,
      'description': desc
    })
  })
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

app.get('/api/users/:_id/exercises', async (req, res) => {
  const getUser = user.findOne({ _id: req.params._id}).exec();
  const thisUser = await getUser;
  const curUser = thisUser.username;
  console.log(curUser);

  const countExercises = session.countDocuments({user_id: req.params._id }).exec();
  const count = await countExercises;
  const strCount = count.toString(); /* Change this back to numeric */
  console.log(strCount);

  const getExercises = session.find({user_id: req.params._id}, 'description duration date' ).exec();
  const exercises = await getExercises;
  console.log(exercises);

  res.json({
    username: curUser,
    count: count,
    _id: req.params._id,
    log: exercises
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
