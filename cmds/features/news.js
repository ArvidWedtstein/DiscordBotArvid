const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class NewsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'news',
            aliases: ['nyheter'],
            group: 'features',
            memberName: 'news',
            description: 'send news',
            userPermissions: ['MANAGE_MESSAGES'],
            argsType: 'multiple',
            format: '{JSON}',
            examples: ['{"title": "my news title",', '"description": "my news"', '}']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id

        commandStats.cmdUse(guildId, 'news')
        const targetChannel = message.mentions.channels.first();
        if (!targetChannel) {
            message.reply(`${language(guild, 'CHANNEL')}`)
            return
        }
        

        // Removes channel mention
        args.shift();
        //console.log(args)
        try {
            // Get JSON data
            const json = JSON.parse(args.join(' '))
            //console.log(json)
            // const { text = ''} = json
            console.log(json)
            targetChannel.send(text, {
                embed: json,
            })
            if (targetChannel.type === 'news') {
                message.crosspost()
            }
        } catch(error) {
            message.reply(`${language(guild, 'JSON_INVALID')} ${error.message}`)
        }
    }
}
