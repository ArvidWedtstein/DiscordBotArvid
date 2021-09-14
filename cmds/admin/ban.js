const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const settings = require('../features/setting')
const Commando = require('discord.js-commando');
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
const settingsSchema = require('../../schemas/settings-schema');
const config = require('../../config.json')
module.exports = class BanCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: ['forceeject'],
            group: 'admin',
            memberName: 'ban',
            description: 'ban a user',
            userPermissions: ['BAN_MEMBERS'],
            argsType: 'multiple',
            details: 'Forcefully remove a user from your beloved server',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL',
                'BAN_MEMBERS'
            ],
            examples: ['ban <user> <reason>']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id;
        commandStats.cmdUse(guildId, 'ban')
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const target = message.mentions.users.first();
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id);
                var d = new Date();
                let reason = args.slice(1).join(' ');

                //If there is no reason
                if (!reason) {
                    reason = `${language(guild, 'BAN_NOREASON')}`;
                }
                if (targetMember === '320137922370338818') {
                    return;
                }
                if (reason.length > 1024) {
                    reason = reason.slice(0, 1021) + '...';
                }
                let result = await settingsSchema.findOne({
                    guildId
                })
                if (result.serverlog) {
                    const logchannel = guild.channels.cache.find(channel => channel.id === result.serverlog);
                    if (logchannel.deleted) return;
                    let logembed = new Discord.MessageEmbed()
                        .setColor(config.botEmbedHex)
                        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
                        .setFooter(`has banned ${targetMember}`, targetMember.displayAvatarURL())
                    logchannel.send({embed: logembed});
                }

                
                if (targetMember.bot) {
                    targetMember.ban({reason: `${reason}`});
                } else {
                    let embed = new Discord.MessageEmbed()
                    .setColor('ff4300')
                    .setTitle(`${boticons(this.client, 'banhammer')}${language(guild, 'BAN_TITLE')} ${message.member.guild}!`)
                    .addField(`${language(guild, 'BAN_REASON')}: `, `${reason}`)
                    .addField('Date: ', d.toLocaleDateString())
                    .addField('Time: ', d.toLocaleTimeString())
                    .addField(`Ban ${language(guild, 'MUTE_BY')}: `, `${message.author}`)
                    let messageEmbed = await target.send(embed);
                    targetMember.ban({reason: `${reason}`});
                }   
                
            } else {
                message.channel.send(`${message.author}, ${language(guild, 'BAN_NOUSERSPECIFIED')}`)
            }
        }
    }
}