const validator = require('validator')
const User = require('../model/user.js')

module.exports = (req, res, next) => {
  let username = req.body.username
  let password = req.body.password
  let name = req.body.name
  let age = req.body.age

  username = validator.normalizeEmail(username)
  if (!validator.isEmail(username)) return res.json({
    status: 'error',
    message: 'Not a valid email'
  })

  if (!User.findOne({ username: username })) return res.json({
    status: 'error',
    message: 'User already exists'
  })

  if (!validator.isInt(age.toString(), { min: 0, max: 125 })) return res.json({
    status: 'error',
    message: 'Invalid age'
  })

  let user = {
    username: username,
    password: password,
    name: name,
    age: age
  }

  new User(user).save((err) => {
    if (err) {
      console.error(err)
      return res.json({
        status: 'error',
        message: err
      })
    }

    return res.json({
      status: 'success',
      data: {
        user
      }
    })
  })

  next()
}
