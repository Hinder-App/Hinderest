const User = require('../model/user.js')
const Session = require('../model/session.js')

module.exports = (req, res, next) => {
  User.findOne({ username: req.params.username }).sort({ date: 'desc' }).exec()
    .then((user) => {
      return getSessions(user.sessions, req.params.number)
    })
    .then((sessions) => {
      return calculateScores(sessions)
    })
    .then((scores) => {
      return res.json({
        status: 'success',
        data: {
          scores: scores
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

function getSessions(sessions, number) {
  if (number) sessions = sessions.slice(0, number)
  sessions = sessions.map((id) => { return Session.findById(id).exec() })
  return Promise.all(sessions)
}

function calculateScores(sessions) {
  let shapeScores = []
  let mathScores = []
  let memoryScores = []

  sessions.forEach((session) => {
    let date = session.date

    shapeScores.push({ date: date, score: session.shapeGames.score })
    mathScores.push({ date: date, score: session.mathGames.score })
    memoryScores.push({ date: date, score: session.memoryGames.score })
  })

  return {
    shapeScores: shapeScores,
    mathScores: mathScores,
    memoryScores: memoryScores
  }
}
