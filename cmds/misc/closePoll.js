const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const tempMsg = require('../misc/temporary-message')
const pollSchema = require('../../schemas/poll-schema');
const config = require('../../config.json')
module.exports = class ClosePollCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'closepoll',
            group: 'misc',
            memberName: 'closepoll',
            description: 'closepoll',
            userPermissions: ['MANAGE_MESSAGES'],
            argsType: 'multiple',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ]
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'poll')
        message.delete()
        const pollId = args[0];
        const res = await pollSchema.findOne({
            pollId: pollId
        })
        if (!pollId || !res) {
            tempMsg(message.channel, "Invalid Poll ID", 10);
            return
        }

        let resembed = new Discord.MessageEmbed()
            .setColor(config.botEmbedHex)
            .setTitle('Results')
            .setDescription(res.question)
            .addFields(
                {name: 'yes', value: `${res.answers.yes}`},
                {name: 'no', value: `${res.answers.no}`}
            )
            .setFooter(`Poll ID ${pollId}`)
        message.channel.send(resembed)
        await pollSchema.deleteOne({
            pollId: pollId
        })
        /*message.channel.messages.fetch(res.messageId).then((messages) => {
            if (messages.deleted || !messages) return
            messages.delete();
        })*/ 
        

    }
}