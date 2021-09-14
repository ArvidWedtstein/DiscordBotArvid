const Discord = require('discord.js');
const config = require('../../config.json')
module.exports = {
    commands: 'reactionrolergb',
    expectedArgs: '',
    permissionError: '',
    minArgs: 0,
    maxArgs: null,
    callback: async (client, message, args, text) => {
        const channel =  message.member.guild.channels.cache.find(channel => channel.name === 'roles');
        const rgbismrole = message.guild.roles.cache.find(role => role.name === "rgbiskop");
        const nonrgbrole = message.guild.roles.cache.find(role => role.name === "no RGB");


        //var rgbemoji = message.guild.emojis.cache.find(emoji => emoji.name == 'rgbimg');
        const nonrgbemoji = '💩';
        const rgbemoji = '🎮';

        let embed = new Discord.MessageEmbed()
        .setColor('ff4300')
        .setTitle('What do you perfer?')
        .setDescription(`What do you perfer? RGB or no RGB?\n\n ${rgbemoji} to become part of RGBism\n${nonrgbemoji} for a less colorful life`)
        .setImage("https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/clans/26312799/264f2c3481add59321cb50e0ce7819f51211d659.gif");
            
        message.delete();
        let messageEmbed = await channel.send(embed);
        messageEmbed.react(rgbemoji);
        messageEmbed.react(nonrgbemoji);

        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == channel) {
                if (reaction.emoji.name === rgbemoji) {

                    //console.log('RGB');
                    await reaction.message.guild.members.cache.get(user.id).roles.add(rgbismrole);
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(nonrgbrole);
                }
                if (reaction.emoji.name === nonrgbemoji) {
                    //console.log('no rgb');
                    await reaction.message.guild.members.cache.get(user.id).roles.add(nonrgbrole);
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(rgbismrole);
                }
            } else {
                return;
            }
        });


        client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == channel) {
                if (reaction.emoji.name === rgbemoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(rgbismrole);

                }
                if (reaction.emoji.name === nonrgbemoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(nonrgbrole);
                }
            } else {
                return;
            }
        });
        

        
    },
    permissions: 'ADMINISTRATOR',
    requiredRoles: [],
}
