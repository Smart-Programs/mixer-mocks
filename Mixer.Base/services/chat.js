const WebSocket = require('ws')
const ws = new WebSocket.Server({ port: 8040 })

const {
  handleAuth,
  handleMsg,
  handleWhisper,
  handleTimeout,
  handlePurge,
  handleDeleteMessage,
  handleClearMessages,
  handleHistory,
  handlePing
} = require('../handlers/chat')

const { broadcastMessage } = require('../helpers')

const { parse } = require('querystring')

ws.on('connection', (client, request) => {
  let query = {}

  if (request.url.includes('?')) query = parse(request.url.split('?')[1])

  client.connectedTo = request.headers['mock-auth'] || query['mock-auth']

  client.send(
    JSON.stringify({
      type: 'event',
      event: 'WelcomeEvent',
      data: {
        server: 'fuck-servers'
      }
    })
  )

  client.on('message', message => {
    try {
      const data = JSON.parse(message)
      if (data.type === 'method') {
        switch (data.method) {
          case 'auth':
            console.log('Chat method handleAuth', data)
            handleAuth(client, data, ws)
            break
          case 'msg':
            console.log('Chat method handleMsg', data)
            handleMsg(client, data, ws)
            break
          case 'whisper':
            console.log('Chat method handleWhisper', data)
            handleWhisper(client, data, ws)
            break
          case 'timeout':
            console.log('Chat method handleTimeout', data)
            handleTimeout(client, data, ws)
            break
          case 'purge':
            console.log('Chat method handlePurge', data)
            handlePurge(client, data, ws)
            break
          case 'deleteMessage':
            console.log('Chat method handleDeleteMessage', data)
            handleDeleteMessage(client, data, ws)
            break
          case 'clearMessages':
            console.log('Chat method handleClearMessages', data)
            handleClearMessages(client, data, ws)
            break
          case 'history':
            console.log('Chat method handleHistory', data)
            handleHistory(client, data, ws)
            break
          case 'ping':
            console.log('Chat method handlePing', data)
            handlePing(client, data, ws)
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

  client.on('close', () => {
    if (
      client.connection &&
      client.connection.channel &&
      client.connection.auth &&
      client.connection.auth.authenticated === true
    ) {
      broadcastMessage(
        ws,
        JSON.stringify({
          type: 'event',
          event: 'UserLeave',
          data: {
            originatingChannel: client.connection.channel,
            username: client.connection.user_name,
            id: client.connection.user_id
          }
        }),
        client.connection.channel,
        client.connectedTo
      )
    }
  })
})

ws.on('listening', () => console.log('Chat listening on port 8040'))
ws.on('close', () => console.log('Chat stopped listening'))
ws.on('error', error => console.error('Chat error', error))

module.exports.Server = ws
