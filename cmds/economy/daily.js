const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const settings = require('../features/setting')
const level = require('../../levels')
module.exports = class DailyXPCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'dailyexperience',
	        aliases: ['dxp', 'dailyxp', 'daily'],
            group: 'economy',
            memberName: 'dailyxp',
            description: 'gives you daily xp',
            throttling: {
				usages: 1,
				duration: 86400,
			},
            userPermissions: ['ADD_REACTIONS']
        })
    }

    async run(message, args) {
        message.delete();
        const { guild } = message
        const setting = await settings.setting(message, 'money');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const guildId = guild.id;
            commandStats.cmdUse(guildId, 'dailyexperience')
            const userId = message.author.id
            let xpreward = 100;
            level.addXP(guildId, userId, xpreward, message)
            message.channel.send(`${message.author} ${language(guild, "DAILY_ERLINGCOINS")}! (${xpreward}xp)`)
        }
    }
}