const { broadcastMessage, getRandomUsername } = require('../../../helpers')

module.exports = function handleTimeout (client, data) {
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

    if (
      !args ||
      args.length !== 2 ||
      (typeof args[0] !== 'string' && typeof args[0] !== 'number') ||
      typeof args[1] !== 'string'
    ) {
      client.send(
        JSON.stringify({ type: 'reply', error: 'UFUCKEDUP', id: data.id })
      )
    } else {
      const timeoutTarget = args[0]
      const timeoutLength = args[1]

      broadcastMessage(
        ws,
        JSON.stringify({
          type: 'event',
          event: 'UserTimeout',
          data: {
            user: {
              user_name:
                typeof timeoutTarget === 'string'
                  ? timeoutTarget
                  : getRandomUsername(),
              user_id:
                typeof timeoutTarget === 'number'
                  ? timeoutTarget
                  : Math.floor(Math.random() * 100000 + 10000),
              user_roles: ['User']
            },
            duration: Math.floor(Math.random() * 1000 + 30)
          }
        }),
        client.connection.channel
      )

      broadcastMessage(
        ws,
        JSON.stringify({
          type: 'event',
          event: 'PurgeMessage',
          data: {
            moderator: {
              user_name: client.connection.user_name,
              user_id: client.connection.user_id,
              user_roles: ['Mod', 'User'],
              user_level: Math.floor(Math.random() * 99 + 1)
            },
            user_id:
              typeof timeoutTarget === 'number'
                ? timeoutTarget
                : Math.floor(Math.random() * 100000 + 10000),
            cause: {
              type: 'timeout',
              durationString: timeoutLength
            }
          }
        }),
        client.connection.channel
      )

      client.send(
        JSON.stringify({
          type: 'reply',
          id: data.id,
          data: `${timeoutTarget} has been timed out for ${timeoutLength}`
        })
      )
    }
  }
}
