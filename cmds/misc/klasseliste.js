const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
module.exports = class Command extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'klasseliste',
            aliases: ['kl'],
            group: 'misc',
            memberName: 'klasseliste',
            description: 'klasseliste',
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
        })
    }

    async run(message, args) {

    }
}