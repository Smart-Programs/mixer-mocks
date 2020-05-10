import React, { useEffect, useState } from 'react'
import './App.css'

import Socket from './helpers/sockets'

function App () {
  const [chatSocket, setChatSocket] = useState()
  const [constellationSocket, setConstellationSocket] = useState()

  useEffect(() => {
    if (!constellationSocket) {
      console.log('ConstellationSocket Creating')

      const newConstellationSocket = Socket(
        'ws://localhost:8050',
        JSON.stringify({
          type: 'method',
          method: 'liveSubscribe',
          params: { events: ['channel:111:update'] },
          id: 0
        })
      )

      setConstellationSocket(newConstellationSocket)

      newConstellationSocket.addEventListener('open', ({ detail }) => {
        console.log('OPEN', detail)
      })

      newConstellationSocket.addEventListener('message', ({ detail }) => {
        console.log('MESSAGE', detail)
      })

      newConstellationSocket.addEventListener('error', ({ detail }) => {
        console.log('ERROR', detail)
      })
    } else {
      console.log('ConstellationSocket is already made')
    }
  }, [constellationSocket])

  useEffect(() => {
    if (!chatSocket) {
      console.log('ChatSocket Creating')

      const newChatSocket = Socket(
        'ws://localhost:8040',
        JSON.stringify({
          type: 'method',
          method: 'auth',
          arguments: [12345, 54321, 'Test key'],
          id: 0
        })
      )

      setChatSocket(newChatSocket)

      newChatSocket.addEventListener('open', ({ detail }) => {
        console.log('OPEN', detail)
      })

      newChatSocket.addEventListener('message', ({ detail }) => {
        console.log('MESSAGE', detail)
      })

      newChatSocket.addEventListener('error', ({ detail }) => {
        console.log('ERROR', detail)
      })
    } else {
      console.log('ChatSocket is already made')
    }
  }, [chatSocket])

  return (
    <div className='App'>
      <button
        onClick={() => {
          if (chatSocket) {
            chatSocket.sendPacket(
              JSON.stringify({
                type: 'method',
                method: 'msg',
                arguments: ['Test Message!'],
                id: 1
              })
            )
          }
        }}
      >
        Send Test Chat
      </button>
      <button
        onClick={() => {
          if (constellationSocket) {
            constellationSocket.sendPacket(
              JSON.stringify({
                type: 'method',
                method: 'fakeEvent',
                event: 'channel:111:update',
                id: 1
              })
            )
          }
        }}
      >
        Send Fake Event
      </button>
    </div>
  )
}

export default App
