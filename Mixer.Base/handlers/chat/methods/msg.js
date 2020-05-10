const { v4: uuidv4 } = require('uuid')

const { broadcastMessage } = require('../../../helpers')

module.exports = function handleMsg (client, data, ws) {
  if (
    !client.connection ||
    typeof client.connection.channel !== 'number' ||
    !client.connection.auth ||
    client.connection.auth.authenticated !== true
  ) {
    client.send(
      JSON.stringify({
        type: 'reply',
        error: 'UNOAUTH',
        id: data.id
      })
    )
  } else {
    const args = data.arguments

    if (!args || args.length !== 1 || typeof args[0] !== 'string') {
      client.send(
        JSON.stringify({ type: 'reply', error: 'UFUCKEDUP', id: data.id })
      )
    } else {
      const message = args[0]

      const sendMessage = {
        channel: client.connection.channel,
        id: uuidv4(),
        user_name: client.connection.user_name,
        user_id: client.connection.user_id,
        user_level: Math.floor(Math.random() * 99 + 1),
        user_avatar: `https://api.adorable.io/avatars/250/${client.connection.user_id}`,
        user_roles: client.connection.auth.roles,
        message: {
          message: [{ type: 'text', data: message, text: message }],
          meta: {}
        }
      }

      broadcastMessage(
        ws,
        JSON.stringify({
          type: 'event',
          event: 'ChatMessage',
          data: sendMessage
        }),
        client.connection.channel
      )

      client.send(
        JSON.stringify({
          type: 'reply',
          id: data.id,
          data: sendMessage
        })
      )
    }
  }
}
