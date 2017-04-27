const User = require('../model/user.js')
const Session = require('../model/session.js')

module.exports = (req, res, next) => {
  let sessionJSON

  addSession(req.body)
    .then((session) => {
      sessionJSON = session
      return addSessionToUser(req.params.username, session._id)
    })
    .then((user) => {
      return res.json({
        status: 'success',
        data: {
          user: user,
          session: sessionJSON
        }
      })
    })
    .catch((err) => {
      console.error(err)
      return res.json({
        status: 'error',
        message: err
      })
    })

  next()
}

function addSession(games) {
  let session = {
    date: games.date,
    shapeGames: {
      score: calculateScores(games.shapeGames),
      results: games.shapeGames
    },
    mathGames: {
      score: calculateScores(games.mathGames),
      results: games.mathGames
    },
    memoryGames: {
      score: calculateScores(games.memoryGames, true),
      results: games.memoryGames
    }
  }

  return new Session(session).save()
}

function addSessionToUser(username, id) {
  return User.findOneAndUpdate({ username: username }, { $push: { sessions: id } }, { new: true }).exec()
}

function calculateScores(games, isMemoryGame) {
  const MEMORY_GAME_MULTIPLIER = 10000000
  const GAME_MULTIPLIER = 10000
  const START_OF_ARRAY = 0
  let score

  if (isMemoryGame) {
    score = games.reduce((acc, result) => {
      return calculateScore(acc, result.correct, result.finishTime, MEMORY_GAME_MULTIPLIER)
    }, START_OF_ARRAY) / games.length
  } else {
    score = games.reduce((acc, result) => {
      return calculateScore(acc, result.correct, result.total, GAME_MULTIPLIER)
    }, START_OF_ARRAY) / games.length
  }

  if (isNaN(score)) return Promise.reject('Finish Time and Total must be an int and cannot be 0')
  return score
}

function calculateScore(acc, correct, total, multiplier) {
  return acc + Math.round((correct / total) * multiplier)
}
