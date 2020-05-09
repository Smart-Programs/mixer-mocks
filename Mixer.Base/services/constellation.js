const WebSocket = require('ws')
const ws = new WebSocket.Server({ port: 8050 })

const { handleLiveSubscribe, handlePing } = require('../handlers/constellation')

ws.on('connection', (client, request) => {
  client.on('message', message => {
    try {
      const data = JSON.parse(message)
      if (data.type === 'method') {
        switch (data.method) {
          case 'liveSubscribe':
            console.log('Constellation method handleLiveSubscribe', data)
            handleLiveSubscribe(client, data)
            break
          case 'ping':
            console.log('Constellation method handlePing', data)
            handlePing(client, data)
            break
          default:
            console.log('Constellation method switch-default', data)
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
        console.log('Constellation type not method', data)
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
      console.error('Constellation Message Parse Error', error)
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

  client.on('open', () => {
    client.connection = {
      client_id: request.headers['client-id'],
      authorization: request.headers.authorization
    }
    client.send(
      JSON.stringify({
        type: 'event',
        event: 'hello',
        data: { authenticated: !!client.connection.authorization }
      })
    )
  })
})

ws.on('listening', () => console.log('Constellation listening on port 8050'))
ws.on('close', () => console.log('Constellation stopped listening'))
ws.on('error', error => console.error('Constellation error', error))

module.exports.Server = ws
