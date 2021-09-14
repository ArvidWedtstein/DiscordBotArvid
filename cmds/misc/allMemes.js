const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class AllMemesCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'allmemes',
            aliases: ['allmeme'],
            group: 'misc',
            memberName: 'allmemes',
            description: 'get all memes',
            userPermissions: ['ADD_REACTIONS'],
            hidden: true
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'allmemes')
        const memeFiles = fs.readdirSync('./memes').filter(file => file.endsWith('.png') + 1);
        for (file in memeFiles) {
            const attachment = new Discord.MessageAttachment(`./memes/${file}.png`, `${file}.png`);
            let embed = new Discord.MessageEmbed()
                .setColor('ff4300')
                .attachFiles(attachment)
                .setImage(`attachment://${file}.png`);
            let messageEmbed = message.channel.send({embed}).catch(console.error);
        }
        /*let mememap = fs.readdirSync('./memes').filter(file => file.endsWith('.png') + 1)
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join(", ");
            if (mememap.length > 1024) mememap = "To many memes to display";
            if (!mememap) mememap = "No memes";
        const embed2 = new Discord.MessageEmbed()
        .setTitle('Meme Bot Memes')
        .addField(mememap.png)
        message.channel.send(embed2);*/
    }
}