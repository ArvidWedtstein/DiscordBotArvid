const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const { MessageButton } = require('discord-buttons')
const icons = require('../icon/icon')
module.exports = class WebsiteCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'website',
	        aliases: ['ws'],
            group: 'features',
            memberName: 'website',
            description: 'link to my website',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
	        //guildOnly: true
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'website')

        const btn = new MessageButton()
            .setURL('https://arvidw.space')
            .setLabel()
        //message.reply(`[Website](https://arvidw.space)`)
        let embed = new Discord.MessageEmbed()
            .setDescription(`${icons(guild, 'chevronright')}[Website](https://arvidw.space)`)
            .setTimestamp()
        let msg = await message.reply({
            embed: embed
        })
        //message.react('<:cpu:787431217871716392>');
    }
}