const economy = require('../../economy')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const settings = require('../features/setting')
const commandStats = require('../../Stats/commandStats')
module.exports = class SetBalanceCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'setbalance',
            aliases: ['setbal'],
            group: 'economy',
            memberName: 'setbalance',
            description: 'sets a users balance',
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
        const mention = message.mentions.users.first()
        message.delete()
        const { guild } = message
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            if (!mention) {
                message.reply(`${language(guild, 'ECONOMY_VALID')}`)
                return
            }
    
            const coins = args[1]
            if (isNaN(coins)) {
                message.reply(`${language(guild, 'ECONOMY_VALID')}`)
                return
            }
            
            const guildId = message.guild.id
            commandStats.cmdUse(guildId, 'setbalance')
            const userId = mention.id
    
            const newCoins = await economy.setCoins(
                guildId,
                userId,
                coins
            )
    
            message.reply(`${language(guild, 'ECONOMY_SETBAL')} <@${userId}>'s ${language(guild, 'ECONOMY_SETBAL2')} ${newCoins} ErlingCoins!`)
        }
    }
}