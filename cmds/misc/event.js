const economy = require('../../economy')
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class WarCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'war',
            aliases: ['warevent'],
            group: 'misc',
            memberName: 'war',
            description: 'start a war',
            userPermissions: ['ADD_REACTIONS']
        })
    }

    async run(message, args) {
        message.delete()

        const UnderAttackRole = message.guild.roles.cache.find(role => role.name === "Under attack");
        const GermanTerritoryRole = message.guild.roles.cache.find(role => role.name === "Tysk Territorium");
        const guildId = message.guild.id
        const userId = message.author.id
        let guildMembers = await message.guild.members.fetch()

        let randomEnemy = message.guild.members.cache.random();
        console.log(randomEnemy.user.username);
        randomEnemy.roles.add(UnderAttackRole);
        let embed = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(randomEnemy.user.displayAvatarURL())
            .setTitle(`${randomEnemy.user.username} is about to be invaded`)
            .setDescription(`Prepare yourself ${randomEnemy}!`)
            .setImage("https://media1.tenor.com/images/ceb3448e3880261098993dfd28acb284/tenor.gif")
            //https://i.imgur.com/mAMOu.gif
        let messageEmbed = await message.channel.send(embed).then(msg => {
            setTimeout(async ()=>{
                function getRandomIntInclusive(min, max) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
                }
                invasionChance = getRandomIntInclusive(0, 100)
                if (invasionChance > 50) {
                    setTimeout(() =>{
                        let embed1 = new Discord.MessageEmbed()
                            .setColor('ff0000')
                            .setThumbnail(randomEnemy.user.displayAvatarURL())
                            .setDescription(`${randomEnemy} was too weak and did not manage to defend himself.\nYou are now a part of **German Territory**, ${randomEnemy}`)
                            .setImage("https://media1.tenor.com/images/ceb3448e3880261098993dfd28acb284/tenor.gif")
                            msg.edit(embed1)
                            setTimeout(() =>{
                                msg.delete();
                            }, 5000);
                        randomEnemy.roles.add(GermanTerritoryRole);
                        randomEnemy.roles.remove(UnderAttackRole);
                    }, 5000);
                } else if (invasionChance < 50) {
                    setTimeout(() =>{
                        let embed2 = new Discord.MessageEmbed()
                            .setColor('ff0000')
                            .setThumbnail(randomEnemy.user.displayAvatarURL())
                            .setDescription(`After a hard battle, ${randomEnemy} managed to defend his territory.`)
                            .setImage("https://media1.tenor.com/images/ceb3448e3880261098993dfd28acb284/tenor.gif")
                        msg.edit(embed2)
                        randomEnemy.roles.remove(UnderAttackRole);
                        randomEnemy.roles.remove(GermanTerritoryRole);
                        setTimeout(() =>{
                            msg.delete();
                        }, 5000);
                    }, 5000);
                }
    
                
            }, 3000);
        })
    }
}