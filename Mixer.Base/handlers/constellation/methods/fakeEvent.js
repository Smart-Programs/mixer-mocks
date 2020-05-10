const { v4: uuidv4 } = require('uuid')
const { broadcastMessage, getRandomUsername } = require('../../../helpers')

module.exports = function handleFakeEvent (client, data, ws) {
  const event = data.event
  const toSend = data.data

  if (
    !event ||
    typeof event !== 'string' ||
    ![2, 3].includes(event.split(':').length)
  ) {
    client.send(
      JSON.stringify({
        type: 'reply',
        error: 'UBADREQ',
        id: data.id
      })
    )
  } else {
    if (event === '⁠⁠⁠⁠announcement:announce') {
      if (
        toSend &&
        typeof toSend === 'object' &&
        Object.keys(toSend).length === 1 &&
        toSend.message &&
        typeof toSend.message === 'string'
      ) {
        broadcastMessage(ws, JSON.stringify(toSend), [event])
        client.send(
          JSON.stringify({
            type: 'reply',
            result: null,
            id: data.id
          })
        )
      } else {
        client.send(
          JSON.stringify({
            type: 'reply',
            error:
              'UBADREQ (announcement is only a string message ex: {message: "Hello World"})',
            id: data.id
          })
        )
      }
    } else {
      const threeLength = [
        'channel:{id}:broadcast',
        'channel:{id}:followed',
        'channel:{id}:hosted',
        'channel:{id}:unhosted',
        'channel:{id}:subscribed',
        'channel:{id}:resubscribed',
        'channel:{id}:resubShared',
        'channel:{id}:directPurchased',
        'channel:{id}:update',
        'costream:{uuid}:update',
        'interactive:{id}:connect',
        'interactive:{id}:disconnect',
        'team:{id}:deleted',
        'team:{id}:memberAccepted',
        'team:{id}:memberInvited',
        'team:{id}:memberRemoved',
        'team:{id}:ownerChanged',
        'user:{id}:achievement',
        'user:{id}:followed',
        'user:{id}:notify',
        'user:{id}:subscribed',
        'user:{id}:resubscribed',
        'user:{id}:teamAccepted',
        'user:{id}:teamInvited',
        'user:{id}:teamRemoved',
        'user:{id}:update',
        'channel:{id}:skill',
        'channel:{id}:patronageUpdate',
        'channel:{id}:subscriptionGifted',
        'user:{id}:subscriptionGifted',
        'progression:{id}:levelup'
      ]

      const parts = event.split(':')

      const matching = threeLength.filter(
        item =>
          item.split(':')[0] === parts[0] && item.split(':')[2] === parts[2]
      )

      if (matching.length === 0) {
        client.send(
          JSON.stringify({
            type: 'reply',
            error: 'UBADREQ',
            id: data.id
          })
        )
      } else {
        let valid = ''

        matching.forEach(match => {
          if (valid === '') {
            const type = match.split(':')[1]

            if (type === '{id}' && !isNaN(Number(parts[1]))) valid = match
            else if (type === '{uuid}' && parts[1].split('-') === 4)
              valid = match
          }
        })

        if (valid === '') {
          client.send(
            JSON.stringify({
              type: 'reply',
              error: 'UBADREQ',
              id: data.id
            })
          )
        } else {
          const channelid = Math.floor(Math.random() * 100000000 + 10000),
            userid = Math.floor(Math.random() * 100000000 + 10000),
            username = getRandomUsername()

          const avatar = `https://api.adorable.io/avatars/250/${userid}`

          const level = Math.floor(Math.random() * 99 + 1),
            experience = Math.floor(Math.random() * 100000000 + 10000),
            sparks = Math.floor(Math.random() * 100000000 + 10000),
            followers = Math.floor(Math.random() * 100000 + 100),
            views = Math.floor(Math.random() * 500000 + 500)

          const createdAt = new Date(
              Math.floor(Math.random() * 150000000 + 1424367787000)
            ).toISOString(),
            updatedAt = new Date(
              Date.now() - Math.floor(Math.random() * 604800000 + 86400000)
            ).toISOString()

          if (valid === 'channel:{id}:broadcast') {
            const broadcast = {
              online: !!Math.round(Math.random())
            }

            broadcastMessage(
              ws,
              JSON.stringify({
                data: broadcast,
                type: 'event',
                event: `channel:${parts[1]}:update`
              }),
              [`channel:${parts[1]}:update`]
            )

            if (broadcast.online) broadcast.id = uuidv4()

            broadcastMessage(
              ws,
              JSON.stringify({
                data: broadcast,
                type: 'event',
                event: event
              }),
              [event]
            )
            client.send(
              JSON.stringify({
                type: 'reply',
                result: null,
                id: data.id
              })
            )
          } else if (valid === 'channel:{id}:followed') {
            const follow = {
              user: {
                level: level,
                social: {},
                id: userid,
                username: username,
                verified: true,
                experience: experience,
                sparks: sparks,
                user_avatar: `https://api.adorable.io/avatars/250/${userid}`,
                bio: '',
                primaryTeam: null,
                createdAt: createdAt,
                updatedAt: updatedAt,
                deletedAt: null,
                channel: {
                  featured: false,
                  id: channelid,
                  userId: userid,
                  token: username,
                  online: false,
                  featureLevel: 0,
                  partnered: false,
                  transcodingProfileId: 1,
                  suspended: false,
                  name: 'This is a stream title',
                  audience: 'teen',
                  viewersTotal: views,
                  viewersCurrent: 0,
                  numFollowers: followers,
                  description: '',
                  typeId: null,
                  interactive: false,
                  interactiveGameId: null,
                  ftl: 0,
                  hasVod: false,
                  languageId: null,
                  coverId: null,
                  thumbnailId: null,
                  badgeId: null,
                  bannerUrl: null,
                  hosteeId: null,
                  hasTranscodes: true,
                  vodsEnabled: true,
                  costreamId: null,
                  createdAt: createdAt,
                  updatedAt: updatedAt,
                  deletedAt: null
                }
              },
              following: !!Math.round(Math.random())
            }

            broadcastMessage(
              ws,
              JSON.stringify({
                data: follow,
                type: 'event',
                event: event
              }),
              [event]
            )
            client.send(
              JSON.stringify({
                type: 'reply',
                result: null,
                id: data.id
              })
            )
          } else if (
            valid === 'channel:{id}:hosted' ||
            valid === 'channel:{id}:unhosted'
          ) {
            const host = {
              hosterId: channelid,
              hoster: {
                featured: false,
                id: channelid,
                userId: userid,
                token: username,
                online: false,
                featureLevel: 0,
                partnered: false,
                transcodingProfileId: 1,
                suspended: false,
                name: username + "'s Channel",
                audience: 'teen',
                viewersTotal: views,
                viewersCurrent: 0,
                numFollowers: followers,
                description: '',
                typeId: null,
                interactive: false,
                interactiveGameId: null,
                ftl: 0,
                hasVod: false,
                languageId: null,
                coverId: null,
                thumbnailId: null,
                badgeId: null,
                bannerUrl: null,
                hosteeId: null,
                hasTranscodes: true,
                vodsEnabled: true,
                costreamId: null,
                createdAt: createdAt,
                updatedAt: updatedAt,
                deletedAt: null
              }
            }

            if (valid === 'channel:{id}:hosted')
              host.auto = !!Math.floor(Math.random())

            broadcastMessage(
              ws,
              JSON.stringify({
                data: host,
                type: 'event',
                event: event
              }),
              [event]
            )
            client.send(
              JSON.stringify({
                type: 'reply',
                result: null,
                id: data.id
              })
            )
          } else if (
            valid === 'channel:{id}:subscribed' ||
            valid === 'channel:{id}:resubscribed' ||
            valid === 'channel:{id}:resubShared'
          ) {
            const sub = {
              user: {
                level: level,
                social: {},
                id: userid,
                username: username,
                verified: true,
                experience: experience,
                sparks: sparks,
                avatarUrl: `https://api.adorable.io/avatars/250/${userid}`,
                bio: '',
                primaryTeam: null,
                createdAt: createdAt,
                updatedAt: updatedAt,
                deletedAt: null
              }
            }

            if (
              valid === 'channel:{id}:resubscribed' ||
              valid === 'channel:{id}:resubShared'
            ) {
              const since = new Date(
                Math.floor(Math.random() * 150000000 + 1424367787000)
              )

              const addMonths = Math.random() * 12 + 1

              sub.since = since.toISOString()
              sub.until = new Date(
                since.valueOf() * 1000 * 60 * 60 * 24 * 30 * addMonths
              ).toISOString()
              sub.totalMonths = addMonths

              if (valid === 'channel:{id}:resubShared')
                sub.currentStreak = Math.random() * addMonths + 1
            }

            broadcastMessage(
              ws,
              JSON.stringify({
                data: sub,
                type: 'event',
                event: event
              }),
              [event]
            )
            client.send(
              JSON.stringify({
                type: 'reply',
                result: null,
                id: data.id
              })
            )
          } else if (valid === 'channel:{id}:subscriptionGifted') {
            const sub = {
              giftReceiverId: userid,
              gifterId: channelid,
              giftReceiverUsername: username,
              gifterUsername: getRandomUsername()
            }

            broadcastMessage(
              ws,
              JSON.stringify({
                data: sub,
                type: 'event',
                event: event
              }),
              [event]
            )
            client.send(
              JSON.stringify({
                type: 'reply',
                result: null,
                id: data.id
              })
            )
          } else if (valid === 'channel:{id}:update') {
            const keys = ['viewersCurrent', 'name', 'typeId', 'numFollowers']

            const toChange = keys[Math.floor(Math.random() * keys.length)]

            let sendData = {}

            if (toChange === 'viewersCurrent')
              sendData.viewersCurrent = Math.floor(Math.random() * 1000 + 5)
            else if (toChange === 'name')
              sendData.name = 'Testing A Title Change'
            else if (toChange === 'typeId')
              sendData.typeId = Math.floor(Math.random() * 50000 + 500)
            else if (toChange === 'numFollowers')
              sendData.numFollowers = followers

            broadcastMessage(
              ws,
              JSON.stringify({
                data: sendData,
                type: 'event',
                event: event
              }),
              [event]
            )
            client.send(
              JSON.stringify({
                type: 'reply',
                result: null,
                id: data.id
              })
            )
          }
        }
      }
    }
  }
}
