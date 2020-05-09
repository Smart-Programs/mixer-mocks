const { getRandomUsername } = require('../../../helpers')

module.exports = function handleAuth (client, data) {
  if (
    client.connection &&
    client.connection.auth &&
    Object.keys(client.connection.auth) !== 0
  ) {
    client.send(
      JSON.stringify({
        type: 'reply',
        error: 'UALREADYAUTH',
        id: data.id
      })
    )
  } else {
    const args = data.arguments

    if (!args || args.length === 0) {
      client.send(
        JSON.stringify({ type: 'reply', error: 'UNOTFOUND', id: data.id })
      )
    } else if (args.length === 1) {
      if (isNaN(args[0])) {
        client.send(
          JSON.stringify({
            type: 'reply',
            error: 'UNOTFOUND',
            id: data.id
          })
        )
      } else {
        client.connection = {
          channel: args[0],
          auth: {
            roles: [],
            authenticated: false
          }
        }
        client.send(
          JSON.stringify({
            type: 'reply',
            id: data.id,
            ...client.connection.auth
          })
        )
      }
    } else if (args.length === 3) {
      if (isNaN(args[0]) || isNaN(args[1])) {
        client.send(
          JSON.stringify({
            type: 'reply',
            error: 'UNOTFOUND',
            id: data.id
          })
        )
      } else if (typeof args[2] !== 'string' || args[2].length === 0) {
        client.send(
          JSON.stringify({
            type: 'reply',
            error: 'UNOTFOUND',
            id: data.id
          })
        )
      } else {
        client.connection = {
          channel: args[0],
          user_id: args[1],
          user_name: getRandomUsername(),
          auth: {
            roles: ['User'],
            authenticated: true
          }
        }
        client.send(
          JSON.stringify({
            type: 'reply',
            id: data.id,
            ...client.connection.auth
          })
        )
      }
    } else {
      client.send(
        JSON.stringify({ type: 'reply', error: 'UFUCKEDUP', id: data.id })
      )
    }
  }
}
