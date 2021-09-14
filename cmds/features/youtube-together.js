const fs = require('fs');
const Discord = require('discord.js');
const { CommandInteraction, Client} = require('discord.js');
const discordTogether = require('./Discord-together')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
module.exports = class Command extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'youtubetogether',
            aliases: ['yt'],
            group: 'features',
            memberName: 'youtubetogether',
            description: 'watch youtube in a voice channel',
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
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'youtubetogether')
        const channel = message.member.voice.channel;
        const channelId = channel.id;
        if (channel.type !== "voice") {
            return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`)
        }

        discordTogether.createTogetherCode(channelId, "youtube").then((x) => message.reply(x.code))
    }
}