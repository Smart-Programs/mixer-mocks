module.exports = function handlePurge (client, data) {
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
