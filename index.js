require('dotenv').load()
const restify = require('restify')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const sessions = require('client-sessions')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./src/model/user.js')

mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('Connected to MongoDB')
})

const server = restify.createServer()
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(sessions({
  cookieName: 'session',
  secret: 'lol',
  duration: 182 * 24 * 60 * 60 * 1000
}))
server.use(passport.initialize())
server.use(passport.session())

passport.use(new LocalStrategy({ passReqToCallback: true }, require('./src/route/users.js')))

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).exec()
    .then((user) => {
      done(null, user)
    })
    .catch((err) => {
      done(err)
    })
})

server.post('/users/:username/scores/:number', require('./src/route/scores.js'))
server.post('/users/:username/scores', require('./src/route/scores.js'))
server.post('/users/:username/sessions', require('./src/route/sessions.js'))

server.post('/users/:username', passport.authenticate('local'), (req, res, next) => {
  User.findOne({ username: req.params.username }).exec()
    .then((user) => {
      return res.json({
        status: 'success',
        data: { user }
      })
    })
    .catch((err) => {
      console.error(err)
      return res.json({
        status: 'error',
        message: err
      })
    })

  next()
})

server.get('/hello/:name', (req, res, next) => {
  res.send(`Hello ${req.params.name}`)
  next()
})

server.listen(process.env.PORT, () => {
  console.log(`${server.name} listening at ${server.url}`)
})
