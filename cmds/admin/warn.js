const warnSchema = require('../../schemas/warn-schema')
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const settings = require('../features/setting')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
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
    
            const guildId = message.guild.id
            const userId = target.id
            const reason = args.join(' ')
            commandStats.cmdUse(guildId, 'warn')
    
            const warning = {
                author: message.member.user.tag,
                timestamp: new Date().getTime(),
                reason
            }
    
            let embed = new Discord.MessageEmbed()
                .setColor('ff4300')
                .setTitle('You just got warned!')
                .addField('Reason: ', `${reason}`)
                .addField('Warned by: ', `${message.author}`)
            let messageEmbed = target.send(embed);
    
            //Send warn in logg
            const logg =  message.member.guild.channels.cache.find(channel => channel.name === 'logg'); //Find Channel named 'logg'
            if (logg) {
                let embedLogg = new Discord.MessageEmbed() 
                .setColor('ff4300')
                .addField('User: ', `${target.username}`)
                .addField('Reason: ', `${reason}`)
                .addField('Warned by: ', `${message.author}`)
                let messageEmbedLogg = logg.send(embedLogg);
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