const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class UserIDCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'userid',
            aliases: ['uid'],
            group: 'admin',
            memberName: 'userid',
            description: 'get userid',
            userPermissions: ['ADMINISTRATOR'],
            argsType: 'multiple',
            guildOnly: true
        })
    }

    async run(message, args) {
        message.delete()
        const guildId = message.guild.id
        commandStats.cmdUse(guildId, 'userid')
        const target = message.mentions.users.first() || this.client.users.cache.find(user => user.id === args[0])
        let image = target.displayAvatarURL();

        message.author.send(`User ID: ${target.id}\nName: <@${target.id}>\nAvatarURL: ${image}`)
    }
}