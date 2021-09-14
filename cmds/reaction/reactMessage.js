const emojiCharacters = require('./emojiCharacters.js');
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class ReactCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'react',
            group: 'reaction',
            memberName: 'react',
            description: 'react to a msg',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        message.delete()

        
        const joined = args.join("");
        const split = joined.trim('-react ').split("");
        
        let embed = new Discord.MessageEmbed()
        .setColor('ff4300')
        .setTitle("")
        .setDescription('Test')
        var embedtext = ""
        let messageEmbed = await message.channel.send(embed);
        for (var i = 0; i < split.length; i++) {
            messageEmbed.react(emojiCharacters[split[i]])
            embedtext += split[i]
            let embed = new Discord.MessageEmbed()
            .setColor('ff4300')
            .setTitle(embedtext)
                    
            let messageEmbed2 = await messageEmbed.edit(embed);
        }
    }
}



