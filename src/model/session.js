const mongoose = require('mongoose')
const Schema = mongoose.Schema

let GameSchema = new Schema({
  _id: false,
  result: { correct: Number, total: Number }
})

let MemoryGameSchema = new Schema({
  _id: false,
  result: { correct: Number, finishTime: Number }
})

let Session = new Schema({
  shapeGames: [GameSchema],
  mathGames: [GameSchema],
  memoryGames: [MemoryGameSchema]
})

module.exports = mongoose.model('Session', Session)
