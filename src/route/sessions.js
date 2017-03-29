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
    shapeGames: body.shapeGames,
    mathGames: body.mathGames,
    memoryGames: body.memoryGames
  }

  return new Session(session).save()
}

function addSessionToUser(username, id) {
  return User.findOneAndUpdate({ username: username }, { $push: { sessions: id } }, { new: true }).exec()
}
