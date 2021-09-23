const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json');
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
module.exports = class CalendarCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'calendar',
            aliases: ['cal'],
            group: 'features',
            memberName: 'calendar',
            description: 'microsoft calendar',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            guildOnly: true,
            guarded: false
        })
    }

    async run(message, args) {
        const { guild, channel, author } = message;
        const guildId = guild.id;
        commandStats.cmdUse(guildId, `${this.name}`);

        
    }
}