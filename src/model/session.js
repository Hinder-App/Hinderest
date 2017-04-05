const mongoose = require('mongoose')
const Schema = mongoose.Schema

let GameSchema = new Schema({
  _id: false,
  correct: Number,
  total: Number
})

let MemoryGameSchema = new Schema({
  _id: false,
  correct: Number,
  finishTime: Number
})

let Session = new Schema({
  date: { type: Date, default: Date.now },
  shapeGames: {
    score: Number,
    results: [GameSchema]
  },
  mathGames: {
    score: Number,
    results: [GameSchema]
  },
  memoryGames: {
    score: Number,
    results: [MemoryGameSchema]
  }
})

module.exports = mongoose.model('Session', Session)
