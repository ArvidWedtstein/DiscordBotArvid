const muteSchema = require('../../schemas/mute-schema')
const Discord = require('discord.js');
const settings = require('../features/setting')
const fs = require('fs');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class UnmuteCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            aliases: ['removemute'],
            group: 'admin',
            memberName: 'unmute',
            description: 'unmute a user',
            userPermissions: ['MUTE_MEMBERS'],
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'unmute')
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {

            if (args.length !== 1) {
                message.reply(`Please use the correct syntax: ${guild.commandPrefix}unmute <Target user\'s @ OR their ID>`)
                return
            }
    
            let id = ''
    
            const target = message.mentions.users.first()
            if (target) {
                id = target.id
            } else {
                id = args[0]
            }
    
            const result = await muteSchema.updateOne({
                guildId: guild.id,
                userId: id,
                current: true,
            }, {
                current: false,
            })
            
            //console.log('RESULT:', result)
            if (result.nModified === 1) {
                // Remove Muted Role
                const mutedRole = guild.roles.cache.find(role => {
                    return role.name === 'Muted'
                })
                if (mutedRole) {
                    const guildMember = guild.members.cache.get(id)
                    guildMember.roles.remove(mutedRole)
                }
                message.reply(`unmuted <@${id}>`)
            } else {
                message.reply(`${language(guild, 'MUTE_NOT')}`)
            }
        }
    }
}



