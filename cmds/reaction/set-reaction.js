const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const reactionSchema = require('../../schemas/reaction-roles-schema')
const { addToCache } = require('./reactionrole')
const Commando = require('discord.js-commando');
module.exports = class ReactionRoleTextCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'reactionrolemessage',
            aliases: ['rrmsg'],
            group: 'reaction',
            memberName: 'reactionrolemessage',
            description: 'setthe text for your reaction',
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
        const { guild, mentions } = message
        const { channels } = mentions
        const targetChannel = channels.first() || message.channel

        if (channels.first()) {
            args.shift()
        }

        const text = args.join(' ')

        const newMessage = await targetChannel.send(text)

        addToCache(guild.id, newMessage)

        new reactionSchema({
            guildId: guild.id,
            channelId: targetChannel.id,
            messageId: newMessage.id,
        })
            .save()
            .catch(() => {
                message.reply('Failed to save to the database')
                .then((message) => {
                    message.delete({
                        timeout: 1000 * 10
                    })
                })
            })
    }
}