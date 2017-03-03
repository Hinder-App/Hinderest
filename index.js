require('dotenv').load()
const restify = require('restify')
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  db = database

  console.log(`Database ${db.databaseName} connected`)

  const server = restify.createServer()
  server.get('/hello/:name', respond)
  server.head('/hello/:name', respond)

  server.listen(process.env.PORT, () => {
    console.log(`${server.name} listening at ${server.url}`)
  })
})

function respond(req, res, next) {
  res.send(`Hello ${req.params.name}`)
  next()
}
