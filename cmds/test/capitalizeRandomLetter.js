const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
module.exports = class RandomLetterCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'capitalizerandomletter',
            aliases: ['crl'],
            group: 'test',
            memberName: 'capitalizerandomletter',
            description: 'capitalizerandomletter',
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
        message.delete()
        function capitalizeRandomLetter(string) {
            var str = string.split("")
            let randomint = string.length - (string.length / 2)
            for (let i = 0; i < randomint; i++) {
                
                let random = Math.floor(Math.random() * string.length)
                if (!string.charAt(random)) return
                
                str[random] = str[random].toUpperCase()
            
                
            }
            return str.join('')
        }

        message.channel.send(capitalizeRandomLetter(args.join(' ')))

    }
}