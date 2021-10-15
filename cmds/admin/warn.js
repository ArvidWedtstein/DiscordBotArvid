const warnSchema = require('../../schemas/warn-schema')
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const settings = require('../features/setting')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const commandStats = require('../../Stats/commandStats');
const settingsSchema = require('../../schemas/settings-schema')

module.exports = class WarnCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            aliases: ['advarsel'],
            group: 'admin',
            memberName: 'warn',
            description: 'warn a user',
            userPermissions: ['KICK_MEMBERS'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        message.delete()
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply('Cannot use this command. Moderation is turned off')
            return
        } else if (setting == true) {
            const target = message.mentions.users.first()
            if (!target) {
                message.reply('Please specify someone to warn.')
                return
            }
            if (target.bot) {
                message.reply('You cannot warn a bot')
                return
            }
            
            args.shift()
            const { guild } = message
            const guildId = message.guild.id
            const userId = target.id
            const reason = args.join(' ')
            commandStats.cmdUse(guildId, 'warn')
    
            const warning = {
                author: message.member.user.tag,
                timestamp: new Date().getTime(),
                reason
            }
            let result = await settingsSchema.findOne({
                guildId
            })
            if (result.serverlog) {
                const logchannel = guild.channels.cache.find(channel => channel.id === result.serverlog);
                if (logchannel.deleted) return;
                let embedLogg = new Discord.MessageEmbed() 
                    .setColor(config.botEmbedHex)
                    .addField('User: ', `${target.username}`)
                    .addField(`${language(guild, 'BAN_REASON')}: `, `${reason}`)
                    .addField('Warned by: ', `${message.author}`)
                logchannel.send({embed: embedLogg});
            }
            
    
            await warnSchema.findOneAndUpdate({
                guildId,
                userId
            }, {
                guildId,
                userId,
                $push: {
                    warnings: warning
                }
            }, {
                upsert: true
            })    
    
            .catch((error) => {
                console.log(error);
            })
        } 
    }
}
module.exports.warn = async (guildId, userId, reason) => {
    const warning = {
        author: "AutoStaff",
        timestamp: new Date().getTime(),
        reason
    }
    await warnSchema.findOneAndUpdate({
        guildId,
        userId
    }, {
        guildId,
        userId,
        $push: {
            warnings: warning
        }
    }, {
        upsert: true
    })
}