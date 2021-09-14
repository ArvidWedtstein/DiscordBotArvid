const fs = require('fs');
const { Message, Util, DiscordAPIError, MessageEmbed } = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
module.exports = class StealEmojiCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'stealemoji',
            aliases: ['steal'],
            group: 'reaction',
            memberName: 'stealemoji',
            description: 'steal a emoji from an other server',
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['ADMINISTRATOR'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        setTimeout(function() {
            message.delete();
        }, 5000)
        const { guild } = message
        if (!args) {
            return message.reply(`${language(guild, 'EMOJI_STEAL')}`);
        }

        for (const rawEmoji of args) {
            const parsedEmoji = Util.parseEmoji(rawEmoji);


            if (parsedEmoji.id) {
                const extension = parsedEmoji.animated ? ".gif" : ".png";

                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
                message.guild.emojis
                    .create(url, parsedEmoji.name)
                    .then((emoji) => {
                        let embed = new MessageEmbed()
                            .setColor(config.botEmbedHex)
                            .setAuthor(`Added`, emoji.url)
                        message.channel.send("** **", {embed: embed})
                    });
            }
        }
    }
}