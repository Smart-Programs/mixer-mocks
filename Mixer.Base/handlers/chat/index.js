module.exports = {
  handleAuth: require('./methods/auth'),
  handleMsg: require('./methods/msg'),
  handleWhisper: require('./methods/whisper'),
  handleTimeout: require('./methods/timeout'),
  handlePurge: require('./methods/purge'),
  handleDeleteMessage: require('./methods/deleteMessage'),
  handleClearMessages: require('./methods/clearMessages'),
  handleHistory: require('./methods/history'),
  handlePing: require('./methods/ping')
}
