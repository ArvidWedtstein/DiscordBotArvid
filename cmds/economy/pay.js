const economy = require('../../economy')
const Discord = require('discord.js');
const config = require('../../config.json')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const settings = require('../features/setting')
const commandStats = require('../../Stats/commandStats')
module.exports = class PayCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'pay',
            aliases: ['give', 'vipps'],
            group: 'economy',
            memberName: 'pay',
            description: 'pay someone erlingcoins',
            guildOnly: true,
            userPermissions: ['SEND_MESSAGES'],
            argsType: 'multiple',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            examples: ['pay <@user>'],
            format: 'pay <@user>'
        })
    }

    async run(message, args) {
        const { guild, member } = message
        const setting = await settings.setting(message, 'money');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const guildId = guild.id
            commandStats.cmdUse(guildId, 'pay')
            const target = message.mentions.users.first()
            if (!target) {
                message.reply(`${language(guild, 'VALID_USER')}`)
                return
            }
            if (target.id == message.author.id) {
                message.reply(`${language(guild, 'VALID_USER')}`)
                return
            }
            const coinsToGive = args[1]
            if (isNaN(coinsToGive)) {
                message.reply(`${language(guild, 'ECONOMY_VALID')}`)
                return
            }
            if (coinsToGive < 0) {
                message.reply(`${language(guild, 'ECONOMY_VALID')}`)
                return
            }
            const coinsOwned = await economy.getCoins(guild.id, member.id)
            if (coinsOwned < coinsToGive) {
                message.reply(`${language(guild, 'ECONOMY_PAYNOMONEY')} ${coinsToGive} ErlingCoins!`)
                return
            }

            const confirmation = await message.channel.send(`${language(guild, 'ECONOMY_PAYVERIFICATION')} ${target} ${coinsToGive}? (Y, N, Yes, No)`)
            const filter = (m) => m.author.id === message.author.id

            const collector = confirmation.channel.createMessageCollector(filter, {
                max: 1,
                time: 60000,
            });
        
            collector.on('collect', async (m) => {
                if (m.content.toLowerCase() == 'y' || 'yes') {
                    const remainingCoins = await economy.addCoins(
                        guild.id,
                        member.id,
                        coinsToGive * -1
                    )
                    const newBalance = await economy.addCoins(
                        guild.id,
                        target.id,
                        coinsToGive
                    )
                    
                    const attachment = new Discord.MessageAttachment(`./img/ErlingMoney.png`, `ErlingMoney.png`);
                    let embed = new Discord.MessageEmbed()
                        .setColor(config.botEmbedHex)
                        .setTitle('Transaction')
                        .setDescription(`${language(guild, 'ECONOMY_PAY')} <@${target.id}> ${coinsToGive} ErlingCoins!`)
                        .addField(`${language(guild, 'ECONOMY_PAYLEFT')}`, `${remainingCoins}`)
                        .attachFiles(attachment)
                        .setThumbnail(`attachment://ErlingMoney.png`);
                    message.channel.send(embed)
                } else if (m.content.toLowerCase() == 'n' || 'no') {
                    tempMsg(m.channel, `${language(guild, 'ECONOMY_PAYCANCELLED')}`, 5)
                }
            });
            
        
            collector.on('end', (collected, reason) => {
                console.log(reason)
                if (reason === 'time') {
                    tempMsg(message.channel,  `${language(guild, 'ECONOMY_PAYCANCELLED')}`, 5);
                    return
                }
            });
        }
    }
}