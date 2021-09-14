const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class CreateChannelCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'createchannel',
            aliases: ['makechannel'],
            group: 'admin',
            memberName: 'createchannel',
            description: 'create a channel',
            userPermissions: ['MANAGE_CHANNELS']
        })
    }

    async run(message, args) {
        const guildId = message.guild.id
        commandStats.cmdUse(guildId, 'createchannel')
        const name = args[0]
            message.guild.channels
                .create(name, {
                    type: 'text',
                })
                .then((channel) => {
                    console.log(channel)
                })
    }
}
