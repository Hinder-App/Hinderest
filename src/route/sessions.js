const User = require('../model/user.js')
const Session = require('../model/session.js')

module.exports = (req, res, next) => {
  let sessionJSON
  let userJSON

  addSession(req.body)
    .then((session) => {
      sessionJSON = session
      return addSessionToUser(req.params.username, session._id)
    })
    .then((user) => {
      userJSON = user
      return res.json({
        status: 'success',
        data: {
          user: userJSON,
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

function addSession(body) {
  let session = {
    date: body.date,
    shapeGames: {
      score: calculateScore(body.shapeGames),
      results: body.shapeGames
    },
    mathGames: {
      score: calculateScore(body.mathGames),
      results: body.mathGames
    },
    memoryGames: {
      score: calculateScore(body.memoryGames, true),
      results: body.memoryGames
    }
  }

  return new Session(session).save()
}

function addSessionToUser(username, id) {
  return User.findOneAndUpdate({ username: username }, { $push: { sessions: id } }, { new: true }).exec()
}

function calculateScore(games, isMemoryGame) {
  let score

  if (isMemoryGame) {
    score = games.reduce((acc, result) => {
      return acc + Math.round(result.correct / result.finishTime * 10000000)
    }, 0) / games.length
  } else {
    score = games.reduce((acc, result) => {
      return acc + Math.round(result.correct / result.total * 10000)
    }, 0) / games.length
  }

  return Math.round(score)
}
