const muteSchema = require('../../schemas/mute-schema')
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const Discord = require('discord.js');
const settings = require('../features/setting')
const language = require('../language/language')
const Commando = require('discord.js-commando');
const { lang } = require('moment');
const commandStats = require('../../Stats/commandStats')
module.exports = class IsMutedCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'ismuted',
            group: 'admin',
            memberName: 'ismuted',
            description: 'check if someone is muted',
            userPermissions: ['USE_EXTERNAL_EMOJIS'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'ismuted')
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            message.delete()
        
            const { guild } = message
            if (args.length !== 1) {
                message.reply(`Correct syntax: ${guild.commandPrefix}ismuted <User ID>`)
                return
            }
    
            const id = args[0]
    
            const members = await guild.members.fetch()
            const target = members.get(id)
            const isInDiscord = !!target
            const currentMute = await muteSchema.findOne({
                userId: id,
                guildId: guild.id,
                current: true,
            })
    
            const embed = new MessageEmbed()
                .setAuthor(`${language(guild, 'MUTE_INFO')} ${target ? target.user.tag : id}`, target ? target.user.displayAvatarURL() : '')
                .addField(`${language(guild, 'MUTE_CURRENT')}`, currentMute ? `${language(guild, 'YES')}` : `${language(guild, 'NO')}`)
                .addField(`${language(guild, 'MUTE_INDISCORD')}`, isInDiscord ? `${language(guild, 'YES')}` : `${language(guild, 'NO')}`)
    
            if (currentMute) {
                const date = new Date(currentMute.expires)
    
                embed
                    .addField(`Mute ${language(guild, 'MUTE_BY')}`, `<@${currentMute.staffId}>`)
                    .addField(`${language(guild, 'BAN_REASON')}`, currentMute.reason.toLowerCase())
                    .addField(`${language(guild, 'MUTE_EXPIRE')}`, `${date.toLocaleString()} EST`)
            }
            message.reply(embed)
        } 
    }
}