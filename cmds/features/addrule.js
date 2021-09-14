const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const rulesSchema = require('../../schemas/rules-schema')
const tempMsg = require('../misc/temporary-message')
const commandStats = require('../../Stats/commandStats')
module.exports = class AddRuleCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'addrule',
            aliases: ['+rule', 'rule'],
            group: 'features',
            memberName: 'addrule',
            description: 'add a rule',
            details: 'add a server rule',
            userPermissions: [
                'ADD_REACTIONS',
                'MANAGE_CHANNELS',
                'BAN_MEMBERS'
            ],
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
            examples: ['addrule <rule>']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild, channel } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'addrule')
        if (!args) {
            tempMsg(message.channel, `${language(guild, 'RULE_ADDPROVIDE')}`, 10)
            return
        }
        const rule = {
            rule: args.join(' '),
            rulecreator: message.author.id
        }
        const result = await rulesSchema.findOneAndUpdate({
            guildId: guild.id
        }, {
            guildId: guild.id,
            channelId: channel.id,
            $push: {
                rules: rule
            },
        }, {
            upsert: true,
        })
        if (!result) {
            new rulesSchema({
                guildId: guild.id,
                channelId: channel.id,
                $push: {
                    rules: rule
                }
            })
        }
        tempMsg(message.channel, `${language(guild, 'RULE_ADD')}`, 10)
    }
}