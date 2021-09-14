const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const { MessageMentions } = require('discord.js')
const tempMsg = require('../misc/temporary-message')
const cache = new Map()
const rulesSchema = require('../../schemas/rules-schema')
const commandStats = require('../../Stats/commandStats')



const loadData = async () => {
    const results = await rulesSchema.find()

    for (const result of results) {
        cache.set(result.guildId, result.channelId)
    }
}
loadData()
module.exports = class SetInformationCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'setinformation',
            aliases: ['setinformationchannel', 'setinfo'],
            group: 'features',
            memberName: 'setinformation',
            description: 'set server rules',
            userPermissions: ['ADD_REACTIONS'],
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
            format: '<info title> - <info description> - <@verfiyrole>',
            examples: ['<info title> - <info description> - <@verfiyrole>']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild, channel } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'setinformation')
        if (!args) {
            message.reply('Set information message "<info title> - <info description>"')
        }
        let verifyrole = message.mentions.roles.first();  
        if (!verifyrole) {
            verifyrole = '';
        }
        let argsWithoutMentions = args.filter(arg => !Discord.MessageMentions.ROLES_PATTERN.test(arg));
        let result = await rulesSchema.findOneAndUpdate({
            guildId: guild.id
        }, {
            guildId: guild.id,
            channelId: channel.id,
            text: argsWithoutMentions.join(' '),
            verifyrole: verifyrole
        }, {
            upsert: true,
        })
        if (!result) {
            result = rulesSchema({
                guildId: guild.id,
                channelId: channel.id,
                text: args.join(' '),
                verifyrole: verifyrole
            }).save()
        }
        cache.set(guild.id, channel.id)

        tempMsg(message.channel, `Information channel set!`, 10)

    }
}


module.exports.getChannelId = (guildId) => {
    return cache.get(guildId)
}