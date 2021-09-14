const swearfilterSchema = require('../../schemas/swearfilter-schema')
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const settings = require('../features/setting')
const commandStats = require('../../Stats/commandStats')
module.exports = class BannedWordsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'bannedwords',
            aliases: ['forbiddenwords', 'swearwords'],
            group: 'admin',
            memberName: 'bannedwords',
            description: 'banned words',
            userPermissions: ['ADD_REACTIONS']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const { id: guildId } = guild
        ommandStats.cmdUse(guildId, 'bannedwords')
        const setting = await settings.setting(message, 'swearfilter');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Swearfilter ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const { guild } = message
            const guildId = guild.id
            const wordresult = await swearfilterSchema.findOne({
                guildId
            })
            message.author.send(`Banned words in ${message.guild.name} are:\n${wordresult.swearwords}`)
        }
        
    }
}