module.exports = function handleHistory (client, data) {
  const args = data.arguments

  if (!args || args.length !== 1 || typeof args[0] !== 'number') {
    client.send(
      JSON.stringify({ type: 'reply', error: 'UFUCKEDUP', id: data.id })
    )
  } else {
    client.send(
      JSON.stringify({
        type: 'reply',
        id: data.id,
        data: []
      })
    )
  }
}
