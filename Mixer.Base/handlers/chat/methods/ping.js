module.exports = function handlePing (client, data) {
  client.send(
    JSON.stringify({
      type: 'reply',
      id: data.id
    })
  )
}
