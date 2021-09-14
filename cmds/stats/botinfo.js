const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
module.exports = class BotInfoCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'botinfo',
            aliases: ['info'],
            group: 'stats',
            memberName: 'botinfo',
            description: `Show some information about Meme bot`,
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
            guarded: true
        })
    }

    async run(message, args) {
        const guildId = message.guild.id;
        commandStats.cmdUse(guildId, `${this.name}`);
        message.delete();
        const { guild } = message

        
        const embed = new Discord.MessageEmbed()
            .setTitle(`${this.client.user.username}`)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setColor(config.botEmbedHex)
            //.setImage(banner)
            .addFields(
                {
                    name: 'Creator',
                    value: this.client.owners
                },
                {
                    name: 'Repository',
                    value: `none`,
                    inline: true
                },
                {
                    name: 'Uptime',
                    value: this.client.uptime.toLocaleString()
                },
                {
                    name: 'Prefix',
                    value: this.client.commandPrefix
                }
            )
        message.channel.send(embed);
    }
}