const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const settings = require('../features/setting')
const commandStats = require('../../Stats/commandStats')
module.exports = class DeleteChannelCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'deletechannel',
            aliases: ['delchannel'],
            group: 'admin',
            memberName: 'deletechannel',
            description: 'deletes a channel',
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['MANAGE_CHANNELS']
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'deletechannel')
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            message.channel.delete()
        }
        
    }
}