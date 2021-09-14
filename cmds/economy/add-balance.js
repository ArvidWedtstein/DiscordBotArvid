const economy = require('../../economy')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const settings = require('../features/setting')
const commandStats = require('../../Stats/commandStats')
module.exports = class AddBalanceCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'addbalance',
	        aliases: ['addbal'],
            group: 'economy',
            memberName: 'addbalance',
            description: 'adds balance to a user',
	        guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
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
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'addbalance')
        message.delete()
        const setting = await settings.setting(message, 'money');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const mention = message.mentions.users.first()
        
            if (!mention) {
                message.reply(`${language(guild, 'VALID_USER')}`)
                return
            }

            const coins = args[1]
            if (isNaN(coins)) {
                message.reply(`${language(guild, 'ECONOMY_VALID')}`)
                return
            }

            const guildId = message.guild.id
            const userId = mention.id

            const newCoins = await economy.addCoins(guildId, userId, coins)

            message.reply(`${language(guild, 'ECONOMY_PAY')} <@${userId}> ${coins} ErlingCoins. \n<@${userId}>, ${language(guild, 'ECONOMY_PAYLEFT')} ${newCoins} ErlingCoins!`)
        }
        
    }
}