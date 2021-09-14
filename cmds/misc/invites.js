const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class InvitesCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'invites',
            group: 'misc',
            memberName: 'invites',
            description: 'invites of a user',
            userPermissions: ['ADD_REACTIONS'],
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
            hidden: true
        })
    }

    async run(message, args) {
        message.delete()
            const { guild } = message
    
            guild.fetchInvites().then((invites) => {
                const inviteCounter = {
                }
    
                invites.forEach((invite) => {
                    const { uses, inviter } = invite
                    const { username, discriminator } = inviter
                    
                    const name = `${username}#${discriminator}`
    
                    inviteCounter[name] = (inviteCounter[name] || 0) + uses
                })
    
                let replyText = 'Invites:'
                
                const sortedInvites = Object.keys(inviteCounter).sort((a, b) => inviteCounter[b] - inviteCounter[a])
                //console.log(sortedInvites);

                sortedInvites.length = 3

                for (const invite in sortedInvites) {
                    const count = inviteCounter[invite]
                    replyText += `\n${invite} has invited ${count} member(s)`
                }
                message.reply(replyText)
            })
    }
}