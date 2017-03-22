require('dotenv').load()
const restify = require('restify')
const mongoose = require('mongoose')
const sessions = require('client-sessions')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./src/model/user.js')
const register = require('./src/route/register.js')

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
  { passReqToCallback: true },
  (req, username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.error(err)
        return done(err)
      }

      if (!user) {
        register(req, (err, newUser) => {
          if (err) return done(err)
          user = newUser
        })
        return done(null, user)
      }

      if (!user.verifyPassword(password)) return done(null, 'Password is incorrect')
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

server.post('/users/:username', passport.authenticate('local'), (req, res, next) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) if (err) {
      console.error(err)
      return res.json({
        status: 'error',
        message: err
      })
    }

    res.json({
      status: 'success',
      data: {
        user
      }
    })

    req.logout()
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
