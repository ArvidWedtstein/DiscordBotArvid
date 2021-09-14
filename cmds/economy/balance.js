const economy = require('../../economy')
const Discord = require('discord.js');
const language = require('../language/language.js')
const config = require('../../config.json')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const settings = require('../features/setting')
module.exports = class BalanceCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'balance',
	        aliases: ['bal', 'money', 'coins', 'coin', 'purse', 'coinpurse'],
            group: 'economy',
            memberName: 'balance',
            description: 'shows your amount of erlingcoins',
	        guildOnly: true,
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        const target = message.author || message.mentions.users.first();
        const { guild } = message
        const guildId = message.guild.id
        const userId = target.id
        commandStats.cmdUse(guildId, 'balance')
        const setting = await settings.setting(message, 'money');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            let coins = await economy.getCoins(guildId, userId);
            let color = await economy.getColor(guildId, userId);
            const erlingcoin = this.client.emojis.cache.get('853928115696828426');
            //const attachment = new Discord.MessageAttachment(`./img/ErlingMoney.png`, `ErlingMoney.png`);
            let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL()}`)
            .setTitle(`${language(guild, "BALANCE_TITLE")}`)
            .setDescription(`${language(guild, "BALANCE_AMOUNT")} **${coins}** ErlingCoin${coins === 1 ? '' : 's'} ${erlingcoin}`)
            //.attachFiles(attachment)
            //.setThumbnail(`attachment://ErlingMoney.png`);
            message.channel.send(embed)
        }
    }   
}