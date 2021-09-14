const warnSchema = require('../../schemas/warn-schema')
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const settings = require('../features/setting')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const config = require('../../config.json')
module.exports = class ListWarnsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'listwarns',
            aliases: ['warns'],
            group: 'admin',
            memberName: 'listwarns',
            description: 'shows your warns',
            userPermissions: ['ADD_REACTIONS'],
            guildOnly: true,
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        const { guild } = message
        const setting = await settings.setting(message, 'moderation');
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'listwarns')
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const target = message.mentions.users.first()

            if (!target) {
                message.reply(`${language(guild, 'VALID_USER')}`)
                return
            }
            const guildId = message.guild.id
            const userId = message.member.id
    
    
            const results = await warnSchema.findOne({
                guildId,
                userId
            })
            if (!results) {
                return 'invalid'
            }
            
    
            let warntxt = `${language(guild, 'WARN_PREVIOUS')} <@${userId}>\n\n`
            
            
            //.addField(`Warned By ${author} for "${reason}"`, `on ${new Date(timestamp).toLocaleDateString()}`)
            for (const warning of results.warnings) {
                const { author, timestamp, reason } = warning
                
                let txt = `Warn ${language(guild, 'MUTE_BY')} ${author} for "${reason}" on ${new Date(timestamp).toLocaleDateString()}\n`
                //message.channel.send(`Warned By ${author} for "${reason}" on ${new Date(timestamp).toLocaleDateString()}`)
                warntxt += txt
            }
            message.delete()
            let embed = new Discord.MessageEmbed()
            .setColor(config.botEmbedHex)
            .setTitle('Warns')
            .setDescription(`${warntxt}`)
            let messageEmbed = message.channel.send('** **', {embed: embed}).catch(console.error);
        }
    }
}