const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
const c = require('ansi-colors');
module.exports = class CommandUseCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'commanduse',
            aliases: ['cmduse'],
            group: 'admin',
            memberName: 'commanduse',
            description: 'see how much a command has been used',
            userPermissions: ['ADD_REACTIONS', 'ADMINISTRATOR'],
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
            guildOnly: true
        })
    }

    async run(message, args) {
        const guildId = message.guild.id;
        let lineupper = `╭───────────────────────────╮`;
        let vert = '│'
        let linelower2 = '├───────────────────────────┤'
        let linelower = '╰───────────────────────────╯';
        const uses = await commandStats.cmdUsages(guildId, args[0])
        console.log(`${vert} ${args[0]} cmd uses: ${c.magenta(uses)}         ${vert}`)
        message.reply(`The Command "${args[0]}" has been used ${uses} time${uses === 1 ? '' : 's'} in this server`);
    }
}