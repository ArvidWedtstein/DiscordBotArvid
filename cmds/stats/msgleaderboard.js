const economy = require('../../economy')
const Discord = require('discord.js');
const mongo = require('../../mongo')
const messageCountSchema = require('../../schemas/message-count-schema')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class MsgLeaderboardCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'msgleaderboard',
            aliases: ['mlb'],
            group: 'stats',
            memberName: 'msgleaderboard',
            description: 'shows top 10 message senders in this server',
            guildOnly: true,
            userPermissions: ['SEND_MESSAGES']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'msgleaderboard')
        const result = await messageCountSchema.find({
            guildId: guildId,
        }).sort({
            messageCount: -1,
        }).limit(10)
        let text = 'TOP 10 active members!\n'
        for (let counter = 0; counter < result.length; ++counter) {
            const { userId, messageCount } = result[counter]
    
            text += `#${counter + 1} <@${userId}> with ${messageCount} messages sent!\n`
        }
    
        message.channel.send(text);
    }
}