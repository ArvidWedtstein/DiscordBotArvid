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
            argsType: 'multiple',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL',
                'MANAGE_NICKNAMES'
            ],
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
            const target = message.mentions.users.first();
            args.shift();
            if(target){
                const member = message.guild.members.cache.get(target.id);
                
                //message.channel.send(`<@${memberTarger.user.id}> changed nickname to ${args[1]}`);
                let embed  = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username} nicknamed`, `${message.author.displayAvatarURL()}`)
                    .setFooter(`${member.user.username} to ${args.join(' ')}`)
                message.reply(embed)
                member.setNickname(args.join(' '), 'YES');
                
            } else {
                message.reply(`${language(guild, 'VALID_USER')}`);
            }
        }
        
    }
}