const Discord = require('discord.js');
const config = require('../../config.json')
const fs = require('fs');
const language = require('../language/language')
const Commando = require('discord.js-commando')

module.exports = class VersionCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'version',
            group: 'stats',
            memberName: 'version',
            description: 'bot version'
        })
    }

    async run(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor(config.botEmbedHex)
            .setTitle('Bot Version')
            .addField('Meme Bot is currently on version: ', `${config.version}`)
        message.channel.send(embed)
    }
}


