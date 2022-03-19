const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats');
module.exports = class BotInfoCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'botinfo',
            aliases: ['memebotinfo', 'info'],
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
        //message.delete();
        const { guild } = message
        
        let totalSeconds = (this.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let txt = days + `day${days === 1 ? '' : 's'}, ${hours} hour${hours === 1 ? '' : 's'}, ${minutes} minute${minutes === 1 ? '' : 's'}`;


        let commands = 0;
        this.client.registry.groups.forEach((g) => {
            g.commands.forEach((c) => {
                commands++;
            })
        });
        const embed = new Discord.MessageEmbed()
            .setTitle(`${this.client.user.username}`)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setColor(config.botEmbedHex)
            .addFields(
                {
                    name: 'Creator',
                    value: this.client.owners,
                    inline: true
                },
                {
                    name: 'Repository',
                    value: `${config.repository}`,
                },
                {
                    name: 'Uptime',
                    value: `${txt}`
                },
                {
                    name: 'Prefix',
                    value: this.client.commandPrefix,
                    inline: true
                },
                {
                    name: 'Commands Loaded:',
                    value: commands
                }
            )
        message.channel.send(embed);
    }
}