const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const reactionSchema = require('../../schemas/reaction-roles-schema')
const Commando = require('discord.js-commando');
const { fetchCache, addToCache } = require('./reactionrole');
module.exports = class ReactionRoleCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'reactionrole',
            aliases: ['rr'],
            group: 'reaction',
            memberName: 'reactionrole',
            description: 'set your own reactionroles',
            userPermissions: ['ADD_REACTIONS'],
            clientPermissions: [
                'SEND_MESSAGES', 
                'READ_MESSAGE_HISTORY', 
                'ADD_REACTIONS',
                'MANAGE_MESSAGES',
                'MANAGE_ROLES'
            ],
            argsType: 'multiple',
            details: '[Channel tag] <message>'
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        
        let emoji = args.shift()
        let role = args.shift()
        const displayName = args.join(' ')

        if (role.startsWith('<@&')) {
            role = role.substring(3, role.length - 1)
        }

        const newRole = guild.roles.cache.find(r => {
            return r.name === role || r.id === role
        }) || null

        if (!newRole) {
            message.reply(`Could not find a role for "${role}"`)
            return
        }

        role = newRole

        if (emoji.includes(':')) {
            const emojiName = emoji.split(':')[1]
            emoji = guild.emojis.cache.find(e => {
                return e.name === emojiName
            })
        }
        const [fetchedMessage] = fetchCache(guild.id)

        if (!fetchedMessage) {
            message.reply(`error`)
            return
        }

        const newLine = `${emoji} ${displayName}`
        let { content } = fetchedMessage

        if (content.includes(emoji)) {
            const split = content.split('\n')

            for (let a = 0; a < split.length; a++) {
                if (split[a].includes(emoji)) {
                    split[a] = newLine
                }
            }
            content = split.join('\n')
        } else {
            content += `\n${newLine}`
            fetchedMessage.react(emoji)
        }

        fetchedMessage.edit(content)

        const obj = {
            guildId: guild.id,
            channelId: fetchedMessage.channel.id,
            messageId: fetchedMessage.id
        }

        await reactionSchema.findOneAndUpdate(obj, {
            ...obj,
            $addToSet: {
                roles: {
                    emoji,
                    roleId: role.id
                }
            }
        }, {
            upsert: true
        })
        addToCache(guild.id, fetchedMessage, emoji, role.id)
    }
}