require('dotenv').load()
const restify = require('restify')
const database = require('./src/database/database.js')

database.connect((db) => {
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
