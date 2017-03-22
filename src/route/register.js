const validator = require('validator')
const User = require('../model/user.js')

module.exports = function register(req, callback) {
  let username = req.body.username
  let password = req.body.password
  let name = req.body.name
  let age = req.body.age

  username = validator.normalizeEmail(username)
  if (!validator.isEmail(username)) return callback(username + ' is not a valid email')

  if (!validator.isInt(age.toString(), { min: 0, max: 125 })) return callback(age + ' is not a valid age')

  let user = {
    username: username,
    password: password,
    name: name,
    age: age
  }

  new User(user).save((err, user) => {
    if (err) {
      console.error(err)
      return callback(err)
    }
    return callback(null, user)
  })
}
