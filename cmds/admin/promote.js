const fs = require('fs');
const Discord = require('discord.js');
const config = require('../../config.json')
const emojis = require('../reaction/emojiCharacters');
const language = require('../Language/language')
const temporaryMessage = require('../misc/temporary-message');
const level = ['713062618805436481', '717830277904334939', '719807112057847828', '719937511757054013', '717831014340100227', '834408247879270490', '844159491355574283', '844160609153974302', '844160748892717096', '844451569722589224', '844503023925461013']
const commandStats = require('../../Stats/commandStats')

const Commando = require('discord.js-commando')
module.exports = class PromoteCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'promote',
            aliases: ['forfrem'],
            group: 'admin',
            memberName: 'promote',
            description: 'promote a user',
            userPermissions: ['MANAGE_ROLES'],
            hidden: true
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'promote')
        var d = new Date();
        let logg = message.member.guild.channels.cache.find(channel => channel.name === 'logg');
        const sendMessage = require("../../commands/temporary-message");

        const target = message.guild.member(message.mentions.users.first() || message.author)

        message.delete()
        
        
        
        
        let currentlevel = '';
        for (let index = 0; index < level.length; index++) {
            const element = level[index];
            if (target.roles.cache.some(role => role.id === level[index])) {
                currentlevel = level[index]
            }
        }

        let embed = new Discord.MessageEmbed()
        .setColor(target.displayHexColor)
        .setTitle(`User Promotion`)
        .setDescription(`${target}: <@&${currentlevel}>\n`)
        .addFields(
            {name: emojis[1], value: 'Lvl10', inline: true},
            {name: emojis[2], value: 'Lvl20', inline: true},
            {name: emojis[3], value: 'Lvl30', inline: true}, 
            {name: emojis[4], value: 'Lvl40', inline: true},
            {name: emojis[5], value: 'Lvl50', inline: true},
            {name: emojis[6], value: 'Lvl60', inline: true},       
        )
        let messageEmbed = await message.channel.send(embed);
        messageEmbed.react(emojis[1]);
        messageEmbed.react(emojis[2]);
        messageEmbed.react(emojis[3]);
        messageEmbed.react(emojis[4]);
        messageEmbed.react(emojis[5]);
        messageEmbed.react(emojis[6]);
        setTimeout(function() {
            messageEmbed.delete()
        }, 8200);
        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            if (user != message.author) {
                await reaction.users.remove(user.id);
                return;
            }
            const targetMember = message.guild.members.cache.get(target.id);
            if (reaction.message.channel.id == message.channel.id) {
                switch (reaction.emoji.name) {
                    case emojis[1]:
                        updateRole(targetMember, level[0], message.author, guild);
                    
                        logg.send(`${target} ${language(guild, 'PROMOTE_MSG')} <@&${level[0]}>`)
                        
                        break;
                    case emojis[2]:
                        updateRole(target, level[1], message.author, guild)    

                        logg.send(`${target} ${language(guild, 'PROMOTE_MSG')} <@&${level[1]}>`)
                        
                        break;
                    case emojis[3]:
                        updateRole(target, level[2], message.author, guild)

                        logg.send(`${target} ${language(guild, 'PROMOTE_MSG')} <@&${level[2]}>`)
                        
                        break;
                    case emojis[4]:
                        updateRole(target, level[3], message.author, guild)

                        logg.send(`${target} ${language(guild, 'PROMOTE_MSG')} <@&${level[3]}>`)
                        
                        break;
                    case emojis[5]:
                        
                        updateRole(target, level[4], message.author, guild)

                        logg.send(`${target} ${language(guild, 'PROMOTE_MSG')} <@&${level[4]}>`)
                        
                        break;
                    case emojis[6]:
                        updateRole(target, level[5], message.author, guild)

                        logg.send(`${target} ${language(guild, 'PROMOTE_MSG')} <@&${level[5]}>`)
                        
                        break;
                }
            }
            
        });
    }
}



const updateRole = async (user, role, author, guild) => {
    
    for (let i = 0; i < level.length; i++) {
        if (user.roles.cache.some(role => role.id === level[i])) {
            user.roles.remove(level[i])
        }
    }
    user.roles.add(role);
    console.log(role)
    let embed = new Discord.MessageEmbed()
    .setColor(user.displayHexColor)
    .setTitle(`${language(guild, 'PROMOTE_USER')}`)
    .setDescription(`${language(guild, 'PROMOTE_DM')} <@&${role}>`)
    .addField('Promoted by: ', `${author}`)
    await user.send(embed);
}