const validator = require('validator')
const User = require('../model/user.js')

exports.get = (req, res, next) => {
  User.findOne({ username: req.params.username }).exec()
    .then(user => exists(user))
    .then(user => res.json({ status: 'success', data: user }))
    .catch((err) => {
      console.error(err)
      return res.json({
        status: 'error',
        message: err
      })
    })

  next()
}

exports.login = (req, username, password, done) => {
  User.findOne({ username: username }).exec()
    .then((user) => {
      if (!user) return register(req)
      return user
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

exports.respond = (req, res, next) => {
  User.findOne({ username: req.params.username }).exec()
    .then(user => res.json({ status: 'success', data: user }))
    .catch((err) => {
      console.error(err)
      return res.json({
        status: 'error',
        message: err
      })
    })

  next()
}

exports.update = (req, res, next) => {
  const body = req.body

  User.findOne({ username: body.username }).exec()
    .then(user => exists(user))
    .then(user => update(user, body))
    .then(user => res.json({ status: 'success', data: user }))
    .catch((err) => {
      console.error(err)
      return res.json({
        status: 'error',
        message: err
      })
    })

  next()
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

function update(user, body) {
  user.password = body.password,
  user.name = body.name,
  user.age = body.age

  return user.save()
}

function exists(user) {
  if (!user) return Promise.reject(new Error(`${user.username} does not exist`))
  return user
}
