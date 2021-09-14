const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class PingCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'pings',
            group: 'misc',
            memberName: 'pings',
            description: 'ping latency',
            userPermissions: ['ADD_REACTIONS']
        })
    }

    async run(message, args) {
        var d = new Date();
            let ping = `${Date.now() - message.createdTimestamp}`;
            let botping = Math.round(client.ws.ping);

                let embed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .addField('Your ping is: ', `${ping}ms`)
                .addField('Bot ping is: ', `${botping}ms`)
                message.delete()
                let messageEmbed = message.channel.send(embed);
    }
}