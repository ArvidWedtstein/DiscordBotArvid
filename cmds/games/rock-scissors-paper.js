const fs = require('fs');
const Discord = require('discord.js');
const { fonts, texturemaps, carbrands } = require('./fast-type-words.json');
const language = require('../language/language')

const Commando = require('discord.js-commando')

module.exports = class FastTypeCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'rock',
            aliases: ['paper', 'scissors', 'rps'],
            group: 'games',
            memberName: 'rockpaperscissors',
            description: 'starts a rock-paper-scissors game',
            guildOnly: true,
            userPermissions: ['SEND_MESSAGES'],
        })
    }

    async run(message, args) {
        const { channel } = message
        const { guild } = message
        const emojis = ['✊', '🤚', '✌️']
        
        let embed = new Discord.MessageEmbed()
        .setColor('ff4300')
        .setTitle(`${language(guild, 'RPS_TITLE')}`)
       
        let messageEmbed = await message.channel.send(embed);
        
        messageEmbed.react(emojis[0]);
        messageEmbed.react(emojis[1]);
        messageEmbed.react(emojis[2]);
        
        function getResult(reaction, botChoice) {
            if ((reaction === emojis[0] && botChoice === emojis[2]) ||
                (reaction === emojis[1] && botChoice === emojis[0]) ||
                (reaction === emojis[2] && botChoice === emojis[1])) {
                    return `${language(guild, 'RPS_WIN')}!`;
                } else if (reaction === botChoice) {
                    return `${language(guild, 'RPS_TIE')}!`
                } else {
                    return `${language(guild, 'RPS_LOOSE')}!`
                }
        }
        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == message.channel.id) {
                const botchoice = emojis[Math.floor(Math.random() * emojis.length)];

                const result = getResult(reaction.emoji.name, botchoice)
                
                let embed2 = new Discord.MessageEmbed()
                    .setColor('ff4300')
                    .setTitle(`${language(guild, 'RPS_TITLE')}`)
                    .addField(result, `${reaction.emoji} vs ${botchoice}`)
                let messageEmbed2 = messageEmbed.edit(embed2);
                messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            } else {
                return;
            }
        });

    }
}