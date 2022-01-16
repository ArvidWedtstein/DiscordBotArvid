const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const figlet = require('util').promisify(require('figlet'));
const commandStats = require('../../Stats/commandStats')
module.exports = class BannerCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'banner',
            group: 'misc',
            memberName: 'banner',
            description: 'banner text',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple',
            ownerOnly: true,
            hidden: true
        })
    }

    async run(message, args) {
        const { guild } = message
        commandStats.cmdUse(guild.id, 'banner')
        if (!args) {
            return message.reply('Unvalid')
        }
        return message.channel.send(await figlet(args, { code: true }));
    }
}