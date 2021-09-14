const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class RebootCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'reboot',
            aliases: ['rb', 'shutdown'],
            group: 'admin',
            memberName: 'reboot',
            description: 'reboot bot',
            userPermissions: ['ADMINISTRATOR'],
            argsType: 'multiple',
            hidden: true,
            ownerOnly: true
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        ommandStats.cmdUse(guildId, 'reboot')
        
        try {
            await message.author.send('Rebooting...')
            process.exit()
        } catch (e) {
            console.log(e.message);
        }
    }
}