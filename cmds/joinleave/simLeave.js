const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class SimLeaveCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'simulateleave',
            aliases: ['simleave'],
            group: 'joinleave',
            memberName: 'simulateleave',
            description: 'simulate a userleave. FOR TEST PURPOSES ONLY',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'simulateleave')
        this.client.emit('guildMemberRemove', message.member)
    }
}

