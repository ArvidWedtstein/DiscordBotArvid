const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando');
module.exports = class UserPresenceCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'userpresence',
            aliases: ['usergame'],
            group: 'test',
            memberName: 'userpresence',
            description: 'get a users presence',
            userPermissions: ['ADD_REACTIONS']
        })
    }

    async run(message, args) {
        message.delete()
        const user = message.mentions.users.first() || message.author;
        this.client.users.cache.each(async member => {
            var presence = member.presence.activities.filter(x=>x.type === "PLAYING") || null;
            let presencetext = ''
            if (!presence.toString() || presence.toString() == 'undefined') {
                presencetext = ''
            } else if (presence.toString() == '[]') {
                presencetext = ''
                return
            } else {
                presencetext += presence[0].name
                await console.log(`${member} is playing ${presencetext}` )
            }
            
        })
        
        
        //message.channel.send(`${user} is playing **${presence[0].name}**`)
    }
}
