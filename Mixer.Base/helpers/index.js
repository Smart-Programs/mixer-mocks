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
