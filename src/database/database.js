const MongoClient = require('mongodb').MongoClient

function Database() {}

Database.prototype.connect = (callback) => {
  MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
    if (err) {
      console.log(err)
      process.exit(1)
    }

    return callback(db)
  })
}

module.exports = new Database()
