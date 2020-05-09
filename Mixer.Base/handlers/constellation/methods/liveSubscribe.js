module.exports = function handleLiveSubscribe (client, data) {
  const params = data.params

  if (
    !params ||
    !params.events ||
    !Array.isArray(params.events) ||
    params.events.length === 0
  ) {
    client.send(
      JSON.stringify({
        type: 'reply',
        error: 'UBADREQ',
        id: data.id
      })
    )
  } else {
    let invalid = [],
      duplicate = []
    params.events.forEach((event, index) => {
      if (typeof event !== 'string')
        invalid.push(`Invalid Event Type: ${typeof event}. Must be string.`)
      else if (client.events && client.events.includes(event))
        duplicate.push(event)
      else if (params.events.findIndex(item => item === event) !== index)
        duplicate.push(event)
      else if (![2, 3].includes(event.split(':').length)) invalid.push(event)
      else if (
        event.split(':').length === 2 &&
        !['⁠⁠⁠⁠announcement:announce'].includes(event)
      )
        invalid.push(event)
      else if (event.split(':').length === 3) {
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
          invalid.push(event)
        } else {
          let valid = false

          matching.forEach(match => {
            if (valid === false) {
              const type = match.split(':')[1]

              if (type === '{id}' && !isNaN(Number(parts[1]))) valid = true
              else if (type === '{uuid}' && parts[1].split('-') === 4)
                valid = true
            }
          })

          if (!valid) invalid.push(event)
        }
      }
    })

    if (invalid.length !== 0) {
      client.send(
        JSON.stringify({
          type: 'reply',
          error: {
            code: 4106,
            message: `Unknown event(s) [${invalid.join(', ')}]`
          },
          id: data.id
        })
      )
    } else if (duplicate.length !== 0) {
      client.send(
        JSON.stringify({
          type: 'reply',
          error: {
            code: 4108,
            message: `Attempted to duplicate subscription to event(s) [${invalid.join(
              ', '
            )}]`
          },
          id: data.id
        })
      )
    } else {
      const prev = client.events || []
      client.events = [...prev, ...params.events]
      client.send(
        JSON.stringify({
          type: 'reply',
          result: null,
          error: null,
          id: data.id
        })
      )
    }
  }
}
