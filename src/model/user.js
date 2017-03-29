const mongoose = require('mongoose')
const Schema = mongoose.Schema

let User = new Schema({
  username: String,
  password: String,
  name: String,
  age: Number,
  sessions: [String]
})

User.methods.verifyPassword = function (password) {
  if (this.password !== password) return false
  return true
}

module.exports = mongoose.model('User', User)
