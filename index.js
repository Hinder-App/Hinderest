require('dotenv').load()
const restify = require('restify')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (err) {
    console.err(err)
    process.exit(1)
  }
  console.log('Connected to MongoDB')
})

const server = restify.createServer()

server.get('/hello/:name', (req, res, next) => {
  res.send(`Hello ${req.params.name}`)
  next()
})

server.listen(process.env.PORT, () => {
  console.log(`${server.name} listening at ${server.url}`)
})
