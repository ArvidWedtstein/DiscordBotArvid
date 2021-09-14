const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class MemeDBCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'memedatabase',
            aliases: ['memedb'],
            group: 'misc',
            memberName: 'memedb',
            description: 'number of memes',
            userPermissions: ['ADD_REACTIONS']
        })
    }

    async run(message, args) {
        message.delete()
        const memeFiles = fs.readdirSync('./memes').filter(file => file.endsWith('.png'));
        const number = memeFiles.length + 2

        
        let embed = new Discord.MessageEmbed()
                .setColor('ff4300')
                .setTitle('Memes')
                .setDescription(`The Meme Database currently has ${number} memes stored!`)
        let messageEmbed = message.channel.send({embed}).catch(console.error);
    }
}