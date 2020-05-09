const { broadcastMessage } = require('../../../helpers')

module.exports = function handleDeleteMessage (client, data, ws) {
  if (
    !client.connection ||
    !client.connection.channel ||
    !client.connection.auth ||
    !client.connection.auth.authenticated === true
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
      broadcastMessage(
        ws,
        JSON.stringify({
          type: 'event',
          event: 'DeleteMessage',
          data: {
            moderator: {
              user_name: client.connection.user_name,
              user_id: client.connection.user_id,
              user_roles: ['Mod', 'User'],
              user_level: Math.floor(Math.random() * 99 + 1)
            },
            id: args[0]
          }
        }),
        client.connection.channel
      )

      client.send(
        JSON.stringify({
          type: 'reply',
          id: data.id,
          data: 'Message deleted.'
        })
      )
    }
  }
}
