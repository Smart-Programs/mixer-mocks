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
    if (channel && client.readyState === WebSocket.OPEN) {
      if (client.channel === channel) client.send(data)
    } else if (client.readyState === WebSocket.OPEN) client.send(data)
  })
}
