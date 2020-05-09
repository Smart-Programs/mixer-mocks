const WebSocket = require('ws')

const ws = new WebSocket('ws://localhost:8040')

ws.on('open', () => {
  ws.send(
    JSON.stringify({
      type: 'method',
      method: 'auth',
      arguments: [12345, 11111, 'test'],
      id: 0
    })
  )
})

ws.on('message', message => {
  console.log({ message, received: true })
  try {
    const data = JSON.parse(message)

    if (data.id === 0 && data.authenticated === true) {
      ws.send(
        JSON.stringify({
          type: 'method',
          method: 'msg',
          arguments: ['test'],
          id: 1
        })
      )
    } else if (data.id === 1) {
      ws.send(
        JSON.stringify({
          type: 'method',
          method: 'whisper',
          arguments: ['test', 'Hey there test!'],
          id: 2
        })
      )
    }
  } catch (error) {
    console.error(error)
  }
})
