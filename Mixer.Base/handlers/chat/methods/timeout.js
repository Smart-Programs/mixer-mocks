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
