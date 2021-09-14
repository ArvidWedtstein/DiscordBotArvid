const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const settings = require('../features/setting')
module.exports = class ClearCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            aliases: ['cls'],
            group: 'admin',
            memberName: 'clear',
            description: 'clear messages',
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['MANAGE_MESSAGES']
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'clear')
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            if(!args[0]) return message.reply(`${language(guild, 'CLEAR_AMOUNT')}`);
            if(isNaN(args[0])) return message.reply(`${language(guild, 'CLEAR_NaN')}`);

            if(args[0] > 100) return message.reply(`${language(guild, 'CLEAR_LIMIT')}`);
            if(args[0] < 1) return message.reply(`${language(guild, 'CLEAR_UNDERLIMIT')}`);

            await message.channel.messages.fetch({limit: args[0]}).then(messages =>{
                //let logg = message.member.guild.channels.cache.find(channel => channel.name === 'logg');
                //logg.send(`${message.author.username} has cleared  ${args[0]} messages`);
                message.channel.bulkDelete(messages);
            });
        }
        
    }
}