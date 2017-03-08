require('dotenv').load()
const restify = require('restify')
const mongoose = require('mongoose')
const sessions = require('client-sessions')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./src/model/user.js')

mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (err) {
    console.err(err)
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

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.error(err)
        return done(err)
      }
      if (!user) {
        return done(err, 'User does not exist')
      }
      if (!user.verifyPassword(password)) return done(null, false)
      return done(null, user)
    })
  }
))

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

server.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.json({
    status: 'success',
    data: {
      message: req.user.username + ' is logged in'
    }
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
