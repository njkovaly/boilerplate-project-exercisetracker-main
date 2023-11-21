const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))

let mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const UserSchema = new mongoose.Schema({
  user: String
})
let user = mongoose.model('User', UserSchema)

const SessionSchema = new mongoose.Schema({
  '_id': Object,
  'description': String,
  'duration': Number,
  'date': Date
})
let session = mongoose.model('Session', SessionSchema)


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
