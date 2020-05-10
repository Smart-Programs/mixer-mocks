const names = [
  'Unsmart',
  'ACPixel',
  'BeepBot',
  'R4ver',
  'JaredFPS',
  'artdude543',
  'MindlessPuppetz',
  'alfw',
  'Simby',
  'BVR',
  'cct'
]

module.exports.getRandomUsername = () => {
  return names[Math.floor(Math.random() * names.length)]
}

module.exports.broadcastMessage = (ws, data, channel) => {
  ws.clients.forEach(client => {
    if (channel && client.readyState === 1) {
      if (
        typeof channel === 'string' &&
        client.connection &&
        client.connection.channel === channel
      )
        client.send(data)
      else if (
        typeof channel === 'object' &&
        Array.isArray(channel) &&
        client.events &&
        client.events.includes(channel[0])
      )
        client.send(data)
    } else if (client.readyState === 1) client.send(data)
  })
}
