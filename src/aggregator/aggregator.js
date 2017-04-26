const Session = require('../model/session.js')

exports.pollScores = pollScores

function pollScores() {
  Session.find().exec()
    .then(sessions => calculateAverages(sessions))
    .then(scores => updateAverages(scores))
    .catch(err => console.error(err))
  return setTimeout(pollScores, 5000)
}

function calculateAverages(sessions) {
  let initialObject = {
    shapeTotal: 0,
    mathTotal: 0,
    memoryTotal: 0
  }

  let aggregateScores = sessions.reduce((acc, session) => {
    return total(acc, session)
  }, initialObject)

  return average(aggregateScores, sessions.length)
}

function updateAverages(scores) {
  exports.averageScores = scores
  return scores
}

function total(acc, session) {
  return {
    shapeTotal: acc.shapeTotal + session.shapeGames.score,
    mathTotal: acc.mathTotal + session.mathGames.score,
    memoryTotal: acc.memoryTotal + session.memoryGames.score
  }
}

function average(scores, length) {
  for (let game in scores) { scores[game] = Math.round(scores[game] / length) }

  return scores
}
