const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const config = require('../../config.json')
module.exports = class DiceCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'dice',
            aliases: ['terning'],
            group: 'misc',
            memberName: 'dice',
            description: 'roll a dice',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            args: [
				{
                    key: 'content',
                    prompt: 'What would you like the content of the message to be?',
                    type: 'string'
                }
			],
        })
    }

    async run(message, args) {
        const guildId = message.guild.id
        commandStats.cmdUse(guildId, 'dice')
        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
        }
        const emoji = this.client.emojis.cache.get('862437381684330597')
        let embed = new Discord.MessageEmbed()
            .setColor(config.botEmbedHex)
            .setTitle(`${emoji} You rolled a ***${getRandomIntInclusive(1, 6)}***`, message.author.avatarURL())
        await message.channel.send(embed)
    }
}