const addReactions = (message, reactions) => {
    if (reactions[0]) {
        message.react(reactions[0])
        reactions.shift()
        if (reactions.length > 0) {
            setTimeout(() => addReactions(message, reactions), 750)
        }
    }   
}

module.exports = async (client, id, text, reactions = [], menu) => {
    const channel = await client.channels.fetch(id)
    menu = menu || ''
    channel.messages.fetch().then((messages) => {
        
        if (messages.size === 0) {
            channel.send(text, menu).then((message) => {
                addReactions(message, reactions)
            })
        } else {
            for (const message of messages) {
                if (message[1].author.id != client.user.id) return
                message[1].edit(text)
                addReactions(message[1], reactions)
            }
        }
    }) 
}