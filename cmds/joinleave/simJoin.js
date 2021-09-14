const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class SimJoinCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'simulatejoin',
            aliases: ['simjoin'],
            group: 'joinleave',
            memberName: 'simulatejoin',
            description: 'simulate a userjoin. FOR TEST PURPOSES ONLY',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'simulatejoin')
        this.client.emit('guildMemberAdd', message.member)
    }
}

