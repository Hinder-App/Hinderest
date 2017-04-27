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
  let score

  if (isMemoryGame) {
    score = games.reduce((acc, result) => {
      return acc + calculateScore(result.correct, result.finishTime, 10000000)
    }, 0) / games.length
  } else {
    score = games.reduce((acc, result) => {
      return acc + calculateScore(result.correct, result.total, 10000)
    }, 0) / games.length
  }

  if (isNaN(score)) return Promise.reject('Finish Time and Total must be an int and cannot be 0')
  return score
}

function calculateScore(correct, total, multiplier) {
  return Math.round((correct / total) * multiplier)
}
