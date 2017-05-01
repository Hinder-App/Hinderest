require('dotenv').load()
const restify = require('restify')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const sessions = require('client-sessions')
const passport = require('passport')
const Router = require('./src/route/router.js')

mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('Connected to MongoDB')
})

const server = restify.createServer({ name: 'Hinderest' })
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(sessions({
  cookieName: 'session',
  secret: 'lol',
  duration: 182 * 24 * 60 * 60 * 1000
}))
server.use(passport.initialize())
server.use(passport.session())

server.listen(process.env.PORT, (err) => {
  if (err) console.error(err)
  Router.init(server)
})
