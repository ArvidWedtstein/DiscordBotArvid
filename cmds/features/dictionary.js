const fs = require('fs');
require('dotenv').config();
const Discord = require('discord.js');
const language = require('../language/language');
const Commando = require('discord.js-commando');
const config = require('../../config.json');
const tempMsg = require('../misc/temporary-message');
const boticons = require('../reaction/boticons');
const commandStats = require('../../Stats/commandStats');
const fetch = require('node-fetch');
const axios = require('axios');
module.exports = class DictionaryCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'dictionary',
            aliases: ['ordbok'],
            group: 'features',
            memberName: 'dictionary',
            description: 'word dictionary',
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
            guildOnly: true,
            guarded: false
        })
    }
    async run(message, args) {
        const { guild, channel, author } = message;
        const guildId = guild.id;
        commandStats.cmdUse(guildId, `${this.name}`);
        
        if (!args[0]) {
            return tempMsg(channel, `You need to provide a word`, 10)
        }
        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${args[0]}`).then((res) => {
            for (let i = 0; i < res.data.length; i++) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Dictionary | ${args[0]}`)
                    .setDescription(`Word: ${res.data[i].word} [${res.data[i].meanings[0].partOfSpeech}]\n
                    **Definition**: ${res.data[i].meanings[0].definitions[0].definition}
                    ${res.data[i].meanings[0].definitions[0].example ? `**Example**: ${res.data[i].meanings[0].definitions[0].example}` : ''}\n\n`)
                    if (res.data[i].origin) {
                        embed.addField(`Origin:`, `${res.data[i].origin}`)
                    }
                    
                channel.send(embed);
            }
            
            //console.log(res.data[0].meanings[0]);
        }).catch((err) => {
            console.error('Err:', err);
        })
    }
}