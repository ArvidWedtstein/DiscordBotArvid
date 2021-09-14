const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const commandStats = require('../../Stats/commandStats')
const Commando = require('discord.js-commando')
module.exports = class Command extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'stealidentity',
            group: 'misc',
            memberName: 'stealidentity',
            description: 'steal a users identity',
            userPermissions: ['ADMINISTRATOR']
        })
    }

    async run(message, args) {
        const target = message.mentions.users.first();
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'stealidentity')
        if(target){
            const memberTarget = message.guild.members.cache.get(target.id);
            message.delete()
            image = target.avatarURL();
            originalimage = client.user.avatarURL();
            console.log(message.guild.me.username);
            originalname = message.guild.me.username;
            client.user.setAvatar(image);
            message.guild.me.setNickname(target.username);
            message.channel.send(`${args[0]} e svett`);
            setTimeout(function() {
                client.user.setAvatar(originalimage);
                message.guild.me.setNickname(originalname);
                    
    
    
            }, 3200);
        } else {
            message.channel.send('Cant find that member');
        }
    }
}
