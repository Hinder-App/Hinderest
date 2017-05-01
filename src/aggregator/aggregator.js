const Session = require('../model/session.js')
const HOUR_IN_MS = 3600000

exports.pollScores = pollScores

function pollScores() {
  Session.find().exec()
    .then(sessions => calculateAverages(sessions))
    .then(scores => updateAverages(scores))
    .catch(err => console.error(err))
  return setTimeout(pollScores, HOUR_IN_MS)
}

function calculateAverages(sessions) {
  let initialObject = {
    colorTotal: 0,
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
    colorTotal: acc.colorTotal + session.colorGames.score,
    mathTotal: acc.mathTotal + session.mathGames.score,
    memoryTotal: acc.memoryTotal + session.memoryGames.score
  }
}

function average(scores, length) {
  for (let game in scores) { scores[game] = Math.round(scores[game] / length) }

  return scores
}
