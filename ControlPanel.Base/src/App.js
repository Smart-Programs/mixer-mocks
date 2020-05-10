import React, { useEffect, useState } from 'react'
import './App.css'

import Socket from './helpers/sockets'

function App () {
  const [chatSockets, setChatSockets] = useState({})
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

  const createChatSocket = id => {
    if (chatSockets[id]) {
      console.log('Already a chat socket with id', id)
    } else {
      const newChatSocket = Socket(
        'ws://localhost:8040',
        JSON.stringify({
          type: 'method',
          method: 'auth',
          arguments: [
            id,
            Math.floor(Math.random() * 10000000 + 1000),
            'Test key'
          ],
          id: 0
        }),
        id
      )

      setChatSockets(prev => {
        let newState = { ...prev }
        newState[id] = newChatSocket

        return newState
      })

      newChatSocket.addEventListener('open', ({ detail }) => {
        console.log('OPEN', detail)
        setChatSockets(prev => {
          return { ...prev }
        })
      })

      newChatSocket.addEventListener('message', ({ detail }) => {
        console.log('MESSAGE', detail)
      })

      newChatSocket.addEventListener('error', ({ detail }) => {
        console.log('ERROR', detail)
      })

      newChatSocket.addEventListener('reconnecting', ({ detail }) => {
        console.log('RECONNECTING', detail)
        setChatSockets(prev => {
          return { ...prev }
        })
      })

      newChatSocket.addEventListener('close', ({ detail }) => {
        console.log('CLOSE', detail)
        setChatSockets(prev => {
          return { ...prev }
        })
      })
    }
  }

  const [inputValue, setInputValue] = useState(0)
  const [chatMessages, setChatMessages] = useState({})

  return (
    <div className='App'>
      <div className='chat-stuff' style={{ margin: '50px 0' }}>
        <h3>Connected to a chat</h3>
        <div>
          Channel ID{' '}
          <input
            style={{ marginLeft: '10px' }}
            type='number'
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value)
            }}
          />
          <button
            style={{ marginLeft: '10px' }}
            onClick={e => createChatSocket(inputValue)}
          >
            Connect to chat
          </button>
        </div>
      </div>

      <div className='connected-chats' style={{ margin: '50px 0' }}>
        <h3>Connected Chats:</h3>
        {Object.keys(chatSockets).length === 0 ? (
          <p>None connected</p>
        ) : (
          Object.keys(chatSockets).map(id => {
            return (
              <div key={id} style={{ marginTop: '25px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <p>
                    Channel {id} (State:{' '}
                    {chatSockets[id].getConnectedState() ? 'Open' : 'Closed'})
                  </p>
                  <button
                    onClick={() => {
                      if (chatSockets[id].getConnectedState() === true)
                        chatSockets[id].close()
                      else chatSockets[id].createSocket()
                    }}
                    style={{ marginLeft: '10px' }}
                  >
                    {chatSockets[id].getConnectedState() ? 'Close' : 'Open'}
                  </button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Message{' '}
                  <input
                    style={{ marginLeft: '10px' }}
                    type='text'
                    placeholder={'Enter Message'}
                    value={chatMessages[id] || ''}
                    onChange={e => {
                      const message = e.target.value

                      setChatMessages(prev => {
                        const newState = { ...prev }
                        newState[id] = message
                        return newState
                      })
                    }}
                  />
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                      chatSockets[id].sendPacket(
                        JSON.stringify({
                          type: 'method',
                          method: 'msg',
                          arguments: [chatMessages[id]],
                          id: 420
                        })
                      )

                      setChatMessages(prev => {
                        const newState = { ...prev }
                        newState[id] = ''
                        return newState
                      })
                    }}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className='connected-chats' style={{ margin: '50px 0' }}>
        <h3>
          Constellation ({constellationSocket ? 'Connected' : 'Not Connected'}):
        </h3>
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
    </div>
  )
}

export default App
