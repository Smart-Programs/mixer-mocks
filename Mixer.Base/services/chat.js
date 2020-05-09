const WebSocket = require('ws')
const ws = new WebSocket.Server({ port: 8040 })

const {
  handleAuth,
  handleMsg,
  handleWhisper,
  handleTimeout,
  handlePurge,
  handleDeleteMessage,
  handleClearMessages
} = require('../handlers/chat')

ws.on('connection', client => {
  client.on('message', message => {
    try {
      const data = JSON.parse(message)
      if (data.type === 'method') {
        switch (data.method) {
          case 'auth':
            console.log('Chat method handleAuth', data)
            handleAuth(client, data)
            break
          case 'msg':
            console.log('Chat method handleMsg', data)
            handleMsg(client, data)
            break
          case 'whisper':
            console.log('Chat method handleWhisper', data)
            handleWhisper(client, data)
            break
          case 'timeout':
            console.log('Chat method handleTimeout', data)
            handleTimeout(client, data)
            break
          case 'purge':
            console.log('Chat method handlePurge', data)
            handlePurge(client, data)
            break
          case 'deleteMessage':
            console.log('Chat method handleDeleteMessage', data)
            handleDeleteMessage(client, data)
            break
          case 'clearMessages':
            console.log('Chat method handleClearMessages', data)
            handleClearMessages(client, data)
            break
          default:
            console.log('Chat method switch-default', data)
            client.send(
              JSON.stringify({
                type: 'reply',
                error: 'MNOTFOUND',
                note: 'WTF Is your message bro? (Method not found/implemented)',
                id: data.id
              })
            )
            break
        }
      } else {
        console.log('Chat type not method', data)
        client.send(
          JSON.stringify({
            type: 'reply',
            error: 'MNOTFOUND',
            note: 'WTF Is your message bro?',
            id: data.id
          })
        )
      }
    } catch (error) {
      console.error('Chat Message Parse Error', error)
      client.send(
        JSON.stringify({
          type: 'reply',
          error: 'UFUCKEDUP',
          note: 'The message failed to parse :)',
          id: 'unknown'
        })
      )
    }
  })
})

ws.on('listening', () => console.log('Chat listening on port 8040'))
ws.on('close', () => console.log('Chat stopped listening'))
ws.on('error', error => console.error('Chat error', error))

module.exports.Server = ws
