const WebSocket = require('ws')

const ws = new WebSocket('ws://localhost:8050')

ws.on('open', () => {
  ws.send(
    JSON.stringify({
      type: 'method',
      method: 'liveSubscribe',
      params: { events: ['channel:774:followed'] },
      id: 0
    })
  )
})

ws.on('message', message => {
  try {
    const data = JSON.parse(message)

    console.log({ data })

    // if (data.id === 0 && data.authenticated === true) {
    //   ws.send(
    //     JSON.stringify({
    //       type: 'method',
    //       method: 'msg',
    //       arguments: ['test'],
    //       id: 1
    //     })
    //   )
    // } else if (data.id === 1) {
    //   ws.send(
    //     JSON.stringify({
    //       type: 'method',
    //       method: 'whisper',
    //       arguments: ['test', 'Hey there test!'],
    //       id: 2
    //     })
    //   )
    // }
  } catch (error) {
    console.error(error)
  }
})
