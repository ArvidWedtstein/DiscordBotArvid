const economy = require('../../economy')
const Discord = require('discord.js');
const language = require('../language/language')
const config = require('../../config.json')
const commandStats = require('../../Stats/commandStats')
const Commando = require('discord.js-commando')
const settings = require('../features/setting')
module.exports = class BegForMoneyCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'askformoney',
            aliases: ['afm', 'beg', 'askbal'],
            group: 'economy',
            memberName: 'askformoney',
            description: 'ask a user for erlingcoins',
            guildOnly: true,
            userPermissions: ['SEND_TTS_MESSAGES'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        message.delete()
        const { guild, member } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'askformoney')
        const setting = await settings.setting(message, 'money');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            var d = new Date();
            const target = message.mentions.users.first()
            if (!target) {
                message.reply(`${language(guild, 'ECONOMY_VALIDUSER')}`)
                return
            }
            if (target == message.author) {
                message.reply(`${language(guild, 'ECONOMY_INVALIDUSER')}`)
                return
            }
    
            const coinsToAsk = args[1]
            if (isNaN(coinsToAsk)) {
                message.reply(`${language(guild, 'ECONOMY_VALID')}`)
                return
            }
            if (coinsToAsk < 0) {
                message.reply(`${language(guild, 'ECONOMY_VALID')}`)
                return
            }
            const yes = '<:yes:807175712515162183>'
            const no = '<:no:807175696555573278>'
            let embed = new Discord.MessageEmbed()
                .setColor(config.botEmbedHex)
                .setDescription(`${language(guild, 'ECONOMY_ASKFORMONEY')} ${coinsToAsk} ErlingCoins, <@${target.id}>`)
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setFooter(`${language(guild, 'ECONOMY_ASKFORMONEYYESNO')}. ${d.toLocaleTimeString()}`)
            let messageEmbed = await message.channel.send(embed).then((message) => {
                message.react(yes);
                message.react(no);
    
                this.client.on('messageReactionAdd', async (reaction, user) => {
                    if (reaction.message.partial) await reaction.message.fetch();
                    if (reaction.partial) await reaction.fetch();
                    if (user.bot) return;
                    if (!reaction.message.guild) return;
                    if (reaction.message.channel.id != message.channel.id) return;
                    if (user != target) {
                        //console.log('NOT OK')
                        await reaction.users.remove(user.id);
                        return;
                    }
                    if (reaction.emoji.name === 'yes') {
                        const coinsOwned = await economy.getCoins(guild.id, target.id)
                        if (coinsOwned < coinsToAsk) {
                            message.reply(`${language(guild, 'ECONOMY_PAYNOMONEY')} ${coinsToGive} ErlingCoins!`)
                            return
                        }
                        const ReactUser = reaction.message.guild.members.cache.get(user.username)
                        let embed = new Discord.MessageEmbed()
                            .setColor('10ff00')
                            .setTitle(`${language(guild, 'PAY_ACCEPT')}`)
                            .setDescription(`${language(guild, 'ECONOMY_ASKFORMONEY')} ${coinsToAsk} ErlingCoins, <@${target.id}>`)
                            .setAuthor(member.user.username, member.user.displayAvatarURL())
                            .setTimestamp()
                            .setFooter(`${language(guild, 'ECONOMY_ASKFORMONEYACCEPTED')}`)
                        await reaction.message.edit(embed);
                        //console.log('Payment Accepted')
    
                        const remainingCoins = await economy.addCoins(
                            guild.id,
                            target.id,
                            coinsToAsk * -1
                        )
                        await economy.addCoins(
                            guild.id,
                            member.id,
                            coinsToAsk
                        )
                        
                        setTimeout(function() {
                            message.delete()
                        }, 8200);
                    }
                    if (reaction.emoji.name === 'no') {
                        let embed = new Discord.MessageEmbed()
                        .setColor('ff0000')
                        .setTitle(`${language(guild, 'PAY_DENIED')}`)
                        .setDescription(`${language(guild, 'ECONOMY_ASKFORMONEY')} ${coinsToAsk} ErlingCoins, <@${target.id}>`)
                        .setAuthor(member.user.username, member.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter(`${language(guild, 'ECONOMY_ASKFORMONEYDENIED')}`)
                        await reaction.message.edit(embed);
                        //console.log('Payment Denied')
                        setTimeout(function() {
                            message.delete()
                        }, 8200);
                    }
                    
                });
            })
        }
    }
}