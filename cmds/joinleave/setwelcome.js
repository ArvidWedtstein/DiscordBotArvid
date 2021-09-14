const welcomeSchema = require('../../schemas/welcome-schema')

const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const tempMsg = require('../misc/temporary-message')
const cache = new Map()

const loadData = async () => {
    const results = await welcomeSchema.find()

    for (const result of results) {
        cache.set(result.guildId, result.channelId)
    }
}
loadData()
module.exports = class SetWelcomeCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'setwelcome',
            aliases: ['setleave', 'setleavechannel', 'setwelcomechannel'],
            group: 'joinleave',
            memberName: 'setwelcome',
            description: 'setwelcome',
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild, channel } = message
        commandStats.cmdUse(guild.id, 'setwelcome')
        await welcomeSchema.findOneAndUpdate({
            guildId: guild.id
        }, {
            guildId: guild.id,
            channelId: channel.id,
            text: args.join(' ')
        }, {
            upsert: true,
        })

        cache.set(guild.id, channel.id)

        tempMsg(message.channel, `Welcome/Leave channel set!`, 10)
    }
}

module.exports.getChannelId = (guildId) => {
    return cache.get(guildId)
}