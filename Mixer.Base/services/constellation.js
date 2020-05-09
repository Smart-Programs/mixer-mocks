const WebSocket = require('ws')
const ws = new WebSocket.Server({ port: 8050 })

ws.on('connection', client => {
  client.on('message', message => {
    console.log({ message, received: true })
  })
})

ws.on('listening', () => console.log('Constellation listening on port 8050'))
ws.on('close', () => console.log('Constellation stopped listening'))
ws.on('error', error => console.error('Constellation error', error))

module.exports.Server = ws
