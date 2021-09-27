const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const icons = require('../icon/icon')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
const gameinvite = require('gameinvite')
module.exports = class GameCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'gamecount',
            aliases: ['gamemembers'],
            group: 'features',
            memberName: 'gamecount',
            description: 'check how many players want to play a game',
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
        message.delete();
        const getEmoji = emojiName => {
            return icons(guild, emojiName)
        }
        const { guild, channel } = message;
        const guildId = message.guild.id;
        commandStats.cmdUse(guildId, `${this.name}`);
        const emoji = args[0];
        args.shift();
        const game = args.join(' ');
        gameinvite.create_game(message, emoji, game, "ff0000")
        
    }
}