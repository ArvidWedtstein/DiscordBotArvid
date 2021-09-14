const fs = require('fs');
const { Message, Util } = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class CreateEmojiCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'createemoji',
            aliases: ['ce'],
            group: 'reaction',
            memberName: 'createemoji',
            description: 'create an emoji from an image',
            userPermissions: ['MOVE_MEMBERS'],
            clientPermissions: ['MANAGE_EMOJIS'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        const { guild } = message
        if (!message.attachments.first()) {
            return message.reply('You need to attach an image to set as emoji')
        }
        const url = message.attachments.first().url;
        const name = message.attachments.first().name;
        message.guild.emojis
        .create(url, name)
        .then((emoji) =>message.reply(`Added: \`${name}\``));
        
    }
}