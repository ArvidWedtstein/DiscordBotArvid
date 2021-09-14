const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
module.exports = class HiCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'hi',
            aliases: ['hello', 'hallo', 'moin'],
            group: 'misc',
            memberName: 'hi',
            description: 'greets you',
            userPermissions: ['SEND_MESSAGES'],
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
        //message.delete();
        const answers = [
            'Hi there',
            'Nice to see you',
            'Hello',
            'Hi',
            'Guten tag,'
        ]
        var randomAnswer = answers[Math.floor(Math.random() * answers.length)];

        tempMsg(message.channel, `${randomAnswer} ${message.author}!`, 10)
    }
}