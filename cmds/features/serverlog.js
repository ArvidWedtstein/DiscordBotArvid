const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
module.exports = class ServerlogCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'serverlog',
            aliases: ['serverlogg', 'guildlogg', 'stafflogg'],
            group: 'features',
            memberName: 'serverlog',
            description: 'create a serverlog and get all moderation events',
            userPermissions: ['ADMINISTRATOR'],
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
        const { guild, channel, mentions } = message;
        const { id: guildId } = guild;
        commandStats.cmdUse(guildId, `${this.name}`);

        const logchannel = mentions.channels.first();
        if (!logchannel) {
            return tempMsg(channel, `Invalid channel`, 10);
        }
    }
}