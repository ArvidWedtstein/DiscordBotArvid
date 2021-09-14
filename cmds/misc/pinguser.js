const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const commandStats = require('../../Stats/commandStats')
const Commando = require('discord.js-commando')
module.exports = class PingUserCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'pinguser',
            aliases: ['pu'],
            group: 'misc',
            memberName: 'pinguser',
            description: 'ping a user',
            userPermissions: ['ADD_REACTIONS']
        })
    }

    async run(message, args) {
        const { guild } = message
        commandStats.cmdUse(guildId, 'pinguser')
        const target = message.mentions.users.first();
        var d = new Date();
        if(target){
            let embed = new Discord.MessageEmbed()
            .setColor('ff4300')
            .setTitle(message.author.username + ' wants to annoy you, ' + target.username)
            message.channel.bulkDelete(1);
            let messageEmbed = await target.send(embed);
        } else {
            message.channel.send('Cant find that member');
        }
    }
}