module.exports = function handlePing (client, data) {
  const unsub =
    data.params && Array.isArray(data.params.events) ? data.params.events : []

  if (client.events)
    client.events = client.events.filter(item => !unsub.includes(item))

  client.send(
    JSON.stringify({
      type: 'reply',
      id: data.id,
      result: null,
      error: null
    })
  )
}
