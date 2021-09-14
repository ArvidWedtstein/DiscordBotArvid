const fs = require('fs');
const Discord = require('discord.js');
const settings = require('../features/setting')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class ClearChannelCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'clearchannel',
            aliases: ['cc'],
            group: 'admin',
            memberName: 'clearchannel',
            description: 'clear a whole channel',
            userPermissions: ['KICK_MEMBERS']
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'clearchannel')
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results, true);
            })
        }
    }
}