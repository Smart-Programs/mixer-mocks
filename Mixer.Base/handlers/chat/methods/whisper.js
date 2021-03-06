const { v4: uuidv4 } = require('uuid')

const { getRandomUsername, broadcastMessage } = require('../../../helpers')

module.exports = function handleWhisper (client, data, ws) {
  if (
    !client.connection ||
    !client.connection.channel ||
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

    if (
      !args ||
      args.length !== 2 ||
      typeof args[1] !== 'string' ||
      (typeof args[0] !== 'string' && typeof args[0] !== 'number')
    ) {
      client.send(
        JSON.stringify({ type: 'reply', error: 'UFUCKEDUP', id: data.id })
      )
    } else {
      const whisperTarget =
        typeof args[0] === 'number' ? getRandomUsername() : args[0]
      const message = args[1]

      const sendWhisper = {
        channel: client.connection.channel,
        id: uuidv4(),
        user_name: client.connection.user_name,
        user_id: client.connection.user_id,
        user_level: Math.floor(Math.random() * 99 + 1),
        user_avatar: `https://api.adorable.io/avatars/250/${client.connection.user_id}`,
        user_roles: client.connection.auth.roles,
        message: {
          message: [{ type: 'text', data: message, text: message }],
          meta: {
            whisper: true
          }
        },
        target: whisperTarget
      }

      broadcastMessage(
        ws,
        JSON.stringify({
          type: 'event',
          event: 'ChatMessage',
          data: sendWhisper
        }),
        client.connection.channel,
        client.connectedTo
      )

      client.send(
        JSON.stringify({
          type: 'reply',
          id: data.id,
          data: sendWhisper
        })
      )
    }
  }
}
