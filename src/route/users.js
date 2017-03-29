const validator = require('validator')
const User = require('../model/user.js')

module.exports = (req, username, password, done) => {
  User.findOne({ username: username }).exec()
    .then((user) => {
      if (!user) return register(req)
      return Promise.resolve(user)
    })
    .then((user) => {
      if (!user.verifyPassword(password)) return done(null, false, 'Password is incorrect')
      return done(null, user)
    })
    .catch((err) => {
      console.error(err)
      return done(err)
    })
}

function register(req) {
  let user = {
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    age: req.body.age
  }

  user.username = validator.normalizeEmail(user.username)
  if (!validator.isEmail(user.username)) return Promise.reject(new Error(user.username + ' is not a valid email'))
  if (!validator.isInt(user.age.toString(), { min: 0, max: 125 })) return Promise.reject(new Error(user.age + ' is not a valid age'))

  return new User(user).save()
}
