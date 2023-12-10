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
  _id: Object,
  username: String
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
  const myID = new mongoose.Types.ObjectId ();
  const name = req.body.username;
  user.create({
    _id: myID,
    username: name
  })
  res.json({
    '_id': myID,  
    'username': name
  })
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const name = req.body.username;
  user.create({
    _id: myID,
    username: name
  })
  res.json({
    '_id': myID,  
    'username': name
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
    res.send(doc._id);
  })

//  const id = req.params.id;
//  res.send(id);
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
