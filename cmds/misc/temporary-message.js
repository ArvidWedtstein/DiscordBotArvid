module.exports = (channel, text, duration = -1) => {
    channel.send(text).then((message) => {
        if (duration === -1) {
            return
        }

        setTimeout(() => {
            let id = channel.messages.fetch(message.id)
            if (message || id) {
                message.delete()
            } else {
                return
            }
            
        }, 1000 * duration)
    })
}