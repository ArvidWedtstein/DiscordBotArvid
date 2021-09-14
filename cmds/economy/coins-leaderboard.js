const economy = require('../../economy')
const coinsLeaderboardSchema = require('../../schemas/coins-leaderboard-schema')
const coinSchema = require('../../schemas/profileschema')
const Discord = require('discord.js');
const settings = require('../features/setting')
const fetchTopMembers = async (guildId, client) => {
    let text = ''

    const results = await coinSchema.find({
        guildId,
    }).sort({
        coins: -1,
    }).limit(10)
    for (let counter = 0; counter < results.length; ++counter) {
        const { userId, coins = 0 } = results[counter]
        text += `#${counter + 1} <@${userId}> with ${coins} ErlingCoins!\n`
    }

    //text += '\nThis is updated every minute'

    return text
}

const updateLeaderboard = async (client, message) => {
    const results = await coinsLeaderboardSchema.find({})
    for (const result of results) {
        const { guildId: guildId } = result
        const guild = client.guilds.cache.get(guildId)
        if (guild) {
            //message.delete();
            const channel = message.channel
            const topMembers = await fetchTopMembers(guildId, client)
            channel.send(topMembers)

        }
    }
    /*setTimeout(async () => {
        await updateLeaderboard(client, message)
    }, 1000 * 60)*/
}
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class KickCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            aliases: ['lb'],
            group: 'economy',
            memberName: 'leaderboard',
            description: 'top 10 users with most erlingcoins',
            guildOnly: true,
            userPermissions: ['SEND_TTS_MESSAGES'],
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
        const target = message.author
        const targetId = target.id
        message.delete();
        const { guild } = message
        const guildId = guild.id
        const setting = await settings.setting(message, 'money');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            updateLeaderboard(this.client, message)
            commandStats.cmdUse(guildId, 'leaderboard')
        }
        

        //const coins = await economy.getCoins(guildId, targetId);

        //message.reply(`You have ${coins} ErlingCoins!`) 
    }
}