const fs = require('fs');
const Discord = require('discord.js');
const settings = require('../features/setting')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class UnBanCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            aliases: ['removeban'],
            group: 'admin',
            memberName: 'unban',
            description: 'unban a member',
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'unban')
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            //const memberTarger = message.guild.members.cache.get(member.id);
            let userID = args[0]
            message.guild.fetchBans().then(bans=> {
            if(bans.size == 0) return 
            let bUser = bans.find(b => b.user.id == userID)
            if(!bUser) return
            message.guild.members.unban(bUser.user)
            })
            message.reply(`${bUser.user} ${language(guild, 'BAN_UNBAN')} ${message.author}`);
        }
    }
}