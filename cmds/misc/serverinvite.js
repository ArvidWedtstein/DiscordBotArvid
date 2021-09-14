const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const commandStats = require('../../Stats/commandStats')
const Commando = require('discord.js-commando')
module.exports = class ServerInviteCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'serverinvite',
            group: 'misc',
            memberName: 'serverinvite',
            description: 'serverinvite',
            userPermissions: ['ADD_REACTIONS'],
            guildOnly: true,
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ]
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'serverinvite')
        /*let invite = await message.channel.createInvite(
        {
          maxAge: 10 * 60 * 1000, // maximum time for the invite, in milliseconds
          maxUses: 1 // maximum times it can be used
        },
        `Requested with command by ${message.author.tag}`
        )*/
    
    .catch(console.log);
        let invite = 'discord.gg/5hMtxNW'
        let embed = new Discord.MessageEmbed()
            .setColor('ff4300')
            .setTitle(`${language(guild, 'SERVER_INVITE')} **${guild.name}**`)
            .setThumbnail(this.client.user.avatarURL())
            .addField('Link:', `[${invite}](${invite})`)
        
        //message.reply(invite ? `Here's your invite: ${invite}` : "There has been an error during the creation of the invite.");
    }
}