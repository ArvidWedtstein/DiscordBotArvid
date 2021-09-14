const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class GuildIdCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'guildid',
            aliases: ['serverid'],
            group: 'admin',
            memberName: 'guildid',
            description: 'get guild information from id',
            userPermissions: ['ADMINISTRATOR'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        message.delete()
        const guildId = message.guild.id
        commandStats.cmdUse(guildId, 'guildid')
        const target = this.client.guilds.cache.find(guild => guild.id === args[0])
        let embed = new Discord.MessageEmbed()
            .setColor("#000000")
            .setTitle('Guild Info')
            .setThumbnail(target.iconURL())
            .setImage(target.discoverySplashURL())
            .addFields(
                {name: 'Guild name: ', value: target.name},
                {name: 'Guild ID: ', value: target.id},
                {name: 'Guild Owner: ', value: target.owner},
                {name: 'Emojis: ', value: target.emojis}
            )
            
            
        let messageEmbed = message.author.send({embed}).catch(console.error);
    }
}