const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const settings = require('../features/setting')
const commandStats = require('../../Stats/commandStats')
const Commando = require('discord.js-commando')
module.exports = class NicknameCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'nickname',
            aliases: ['nick'],
            group: 'admin',
            memberName: 'nickname',
            description: 'nickname a user',
            userPermissions: ['KICK_MEMBERS'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'nickname')
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const member = message.mentions.users.first();
            if(member){
                
                
                //message.channel.send(`<@${memberTarger.user.id}> changed nickname to ${args[1]}`);
                let embed  = new Discord.MessageEmbed()
                    .setAuthor(`${message.author} nicknamed`, `${message.author.displayAvatarURL()}`)
                    .setFooter(`${member.username} to ${args[1]}`)
                message.reply(embed)
                member.setNickname(args[1]);
                message.delete()
            } else {
                message.reply(`${language(guild, 'VALID_USER')}`);
            }
        }
        
    }
}