const fs = require('fs');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const settings = require('../features/setting')
const commandStats = require('../../Stats/commandStats')
module.exports = class KickCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'admin',
            memberName: 'kick',
            description: 'Kicks members',
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'kick')
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const target = message.mentions.users.first();
            if (target) {
                message.delete()

                let reason = args.slice(1).join(' ');

                //If there is no reason
                if (!reason) {
                    reason = `${language(guild, 'BAN_NOREASON')}`;
                }

                if (reason.length > 1024) {
                    reason = reason.slice(0, 1021) + '...';
                }



                
                //console.log(target.username + ' kick');
                
                

                const targetMember = message.guild.members.cache.get(target.id);
                let logg = message.member.guild.channels.cache.find(channel => channel.name === 'logg');
                logg.send(`${message.author} has kicked ${target.username}`);
                targetMember.kick(reason);
            } else {
                message.channel.send(`${message.author}, ${language(guild, 'USER_NOTFOUND')}`)
            }   
        }
    }
}


