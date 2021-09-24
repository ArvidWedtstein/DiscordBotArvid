const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class EmojiListCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'emojilist',
            group: 'stats',
            memberName: 'emojilist',
            description: 'shows all of the servers emojis',
            userPermissions: ['ADD_REACTIONS'],
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
        })
    }

    async run(message, args) {
        message.delete();
            let emojis = message.guild.emojis.cache
            .sort((a, b) => b.position - a.position)
            .map((e) => `${e} - \`:${e.name}:\``)
            .join("\n");

            if (emojis.length > 1024) emojis = emojis.slice(1024, emojis.length - 1024)
            if (!emojis) emojis = "No emojis";
        const embed2 = new Discord.MessageEmbed()
        .setTitle('Server Emojis')
        .addField("Emojilist" , emojis)
        message.channel.send(embed2);
        const guildId = message.guild.id
        commandStats.cmdUse(guildId, 'emojilist')
    }
}


