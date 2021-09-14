const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const commandStats = require('../../Stats/commandStats')
const Commando = require('discord.js-commando')
module.exports = class HowGayCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'howgay',
            aliases: ['hg'],
            group: 'misc',
            memberName: 'howgay',
            description: 'find a users percentage of gayness',
            userPermissions: ['ADD_REACTIONS'],
            //nsfw: true,
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        message.delete()
        const emoji = '801707111657504799'
        const guildId = message.guild.id
        commandStats.cmdUse(guildId, 'howgay')
        if (message.mentions.users.first()) {
            const member = message.mentions.users.first().username
            function getRandomIntInclusive(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
            }
            const gay = getRandomIntInclusive(0, 100)
            //console.log(gay)
            
            
            let embed = new Discord.MessageEmbed()
                    .setColor('ff00ff')
                    .setTitle('Gayness Meter')
                    .setDescription(`According to my results, ${member}.\nis ${gay}% gay`)
            let messageEmbed = await message.channel.send({embed: embed}).then(embedMessage => {
                if (gay > 60) {
                    embedMessage.react(this.client.emojis.cache.get(emoji))
                    
                }
            });
            
        } else {
            if (!args[0]) {
                return message.reply('You need to define a thing or user -howgay <thing/user>')
            }
            function getRandomIntInclusive(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
            }
            const gay = getRandomIntInclusive(0, 100)
            //console.log(gay)
            
            let embed = new Discord.MessageEmbed()
                    .setColor('ff00ff')
                    .setTitle('Gayness Meter')
                    .setDescription(`According to my results, ${args[0]}.\nis ${gay}% gay`)
            let messageEmbed = await message.channel.send({embed: embed}).then(embedMessage => {
                if (gay > 60) {
                    embedMessage.react(this.client.emojis.cache.get(emoji))
                    
                }
            });
        }
    }
}