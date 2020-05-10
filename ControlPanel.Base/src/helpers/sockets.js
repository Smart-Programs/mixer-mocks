class SocketConnection extends EventTarget {
  constructor (url, onOpen) {
    super()

    this.url = url
    this.onOpen = onOpen

    this.shouldClose = false
    this.reconnectTries = 0

    this.createSocket()
  }

  createSocket () {
    this.ws = new WebSocket(this.url)
    this.createListeners()
  }

  createListeners () {
    this.ws.onopen = () => {
      this.shouldClose = false
      this.reconnectTries = 0

      if (this.onOpen) this.sendPacket(this.onOpen)

      this.dispatchEvent(
        new CustomEvent('open', { detail: { message: 'Socket Open' } })
      )
    }

    this.ws.onmessage = ({ data: message }) => {
      try {
        const data = JSON.parse(message)

        this.dispatchEvent(
          new CustomEvent('message', {
            detail: data
          })
        )
      } catch (error) {
        this.dispatchEvent(
          new CustomEvent('error', {
            detail: {
              source: 'message',
              error: { message: 'Could Not Parse', details: error }
            }
          })
        )
      }
    }

    this.ws.onerror = error => {
      this.dispatchEvent(
        new CustomEvent('error', {
          detail: {
            source: 'error',
            error: { message: 'A socket error occurred', details: error }
          }
        })
      )
    }

    this.ws.onclose = event => {
      if (this.shouldClose !== true) {
        setTimeout(() => {
          this.reconnectTries += 1
          this.createSocket()
        }, 250 + this.reconnectTries * 500)

        this.dispatchEvent(
          new CustomEvent('reconnecting', {
            detail: {
              source: 'close',
              event
            }
          })
        )
      } else {
        this.dispatchEvent(
          new CustomEvent('close', {
            detail: {
              source: 'close',
              event
            }
          })
        )
      }
    }
  }

  sendPacket (data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data)
    } else {
      this.dispatchEvent(
        new CustomEvent('error', {
          detail: {
            source: 'sendPacket',
            error: {
              message: 'No Socket Open',
              details: {
                ws: this.ws,
                readyState: this.ws ? this.ws.readyState : NaN
              }
            }
          }
        })
      )
    }
  }

  close () {
    this.shouldClose = true

    this.ws.close()
  }
}

module.exports = function Sockets (url, onOpen) {
  if (Sockets.instances && Sockets.instances.has(url))
    return Sockets.instances.get(url)

  if (Sockets.instances)
    Sockets.instances.set(url, new SocketConnection(url, onOpen))
  else {
    Sockets.instances = new Map()
    Sockets.instances.set(url, new SocketConnection(url, onOpen))
  }

  return Sockets.instances.get(url)
}
