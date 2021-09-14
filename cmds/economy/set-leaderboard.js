const economy = require('../../economy')
const coinsLeaderboardSchema = require('../../schemas/coins-leaderboard-schema')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const settings = require('../features/setting')
const commandStats = require('../../Stats/commandStats')
module.exports = class SetMoneyLeaderboardCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'setleaderboard',
            aliases: ['slb'],
            group: 'economy',
            memberName: 'setleaderboard',
            description: 'sets erlingcoins leaderboard',
            guildOnly: true,
            userPermissions: ['KICK_MEMBERS'],
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
        const { guild, channel } = message
        message.delete();
        const setting = await settings.setting(message, 'money');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const guildId = guild.id
            commandStats.cmdUse(guildId, 'setleaderboard')

            await coinsLeaderboardSchema.findOneAndUpdate({
                guildId: guildId,
            }, {
                guildId: guildId,
            }, {
                upsert: true
            })
    
            message.reply('LeaderBoard Set.')
                .then((message) => {
                    message.delete({
                        timeout: 1000 * 5,
                    })
                })
            //message.delete()
        }
    }
}