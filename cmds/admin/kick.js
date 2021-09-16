const fs = require('fs');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const settings = require('../features/setting')
const Discord = require('discord.js');
const settingsSchema = require('../../schemas/settings-schema');
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
                let result = await settingsSchema.findOne({
                    guildId
                })
                if (result.serverlog) {
                    const logchannel = guild.channels.cache.find(channel => channel.id === result.serverlog);
                    if (logchannel.deleted) return;
                    let logembed = new Discord.MessageEmbed()
                        .setColor(config.botEmbedHex)
                        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
                        .setDescription(`kicked\n\n${language(guild, 'BAN_REASON')}: ${reason}`)
                        .setFooter(`${targetMember}`, targetMember.displayAvatarURL())
                    logchannel.send({embed: logembed});
                }
                targetMember.kick(reason);
            } else {
                message.channel.send(`${message.author}, ${language(guild, 'USER_NOTFOUND')}`)
            }   
        }
    }
}


