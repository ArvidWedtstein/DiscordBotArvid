const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')

module.exports = class ServerListCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'serverlist',
            group: 'stats',
            memberName: 'serverlist',
            description: 'shows all my servers'
        })
    }

    async run(client, message, args) {
        message.delete();
        client.guilds.cache.forEach((guild) => {
            console.log(guild.name);
            servers = guild.name;
            let embedCom = new Discord.MessageEmbed()
                .setColor('ff4300')
                .setTitle(`${client.user.tag} Servers:`)
                .setDescription(`${servers}`)
                let messageEmbed = message.channel.send(embedCom);
        })
    }
}