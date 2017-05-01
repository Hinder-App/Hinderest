const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../model/user.js')
const handler = {
  scores: require('./scores.js'),
  sessions: require('./sessions.js'),
  users: require('./users.js')
}

exports.init = (server) => {
  passport.use(new LocalStrategy({ passReqToCallback: true }, handler.users.handle))
  passport.serializeUser((user, done) => { done(null, user._id) })
  passport.deserializeUser((id, done) => {
    User.findById(id).exec()
      .then(user => done(null, user))
      .catch(err => done(err))
  })

  server.get('/users/:username/scores/:number', handler.scores)
  server.get('/users/:username/scores', handler.scores)
  server.post('/users/:username/sessions', handler.sessions)
  server.post('/users/:username', passport.authenticate('local'), handler.users.respond)

  console.log(`${server.name} is listening at ${server.url}`)
}
