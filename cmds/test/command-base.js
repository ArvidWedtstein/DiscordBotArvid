/*const mongo = require('../../mongo')
const commandPrefixSchema = require('../../schemas/command-prefix-schema')
const { prefix: globalPrefix } = require('../../config.json')
const guildPrefixes = {} // { 'guildId' : 'prefix' }
const Discord = require('discord.js');
const c = require('ansi-colors')
const tempMsg = require('./temporary-message')
const language = require('./Language/language')

const validatePermissions = (permissions) => {
    const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
    ]

    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unknown permission node "${permission}"`)
        }
    }
}

let recentlyRan = []

module.exports = (client, commandOptions) => {
    let {
        commands, 
        description = '',
        expectedArgs = '',
        permissionError = 'You do not have permission to run this command',
        minArgs = 0,
        maxArgs = null,
        cooldown = -1,
        permissions = [],
        requiredRoles = [],
        blockedChannels = [],
        callback,
    } = commandOptions

    if (!commands) {
        return
    }


    if (typeof commands === 'string') {
        commands = [commands]
    }

    console.log(c.red(`│ ${c.white(`Registering command ${c.greenBright(`${commands[0]}`)}`)}`))


    if (permissions.length) {
        if (typeof permissions === 'string') {
            permissions = [permissions]
        }

        validatePermissions(permissions)
    }


    client.on('message', async (message) => {
        if (message.author.bot) {
            return
        }
        const { member, content, guild } = message
        if (!guild) {
            return;
        }
        const prefix = guildPrefixes[guild.id] || globalPrefix

        for (const alias of commands) {
            const command = `${prefix}${alias.toLowerCase()}`
            if (content.toLowerCase().startsWith(`${command} `) || content.toLowerCase() === command) {
                // A command has been ran

                // Ensure the user has the permissions
                for (const permission of permissions) {
                    if (!member.hasPermission(permission)) {
                        message.reply(permissionError)
                        return
                    }
                }

                // Ensure the user has the roles
                for (const requiredRole in requiredRoles) {
                    const role = guild.roles.cache.find(role => role.name === requiredRole)
                    console.log(requiredRole)
                    if (!role || !member.roles.cache.has(role.id)) {
                        message.reply(`You must have the "${requiredRole}" role to use this command.`)
                        return
                    }
                }

                // Ensure the command is not in blockedChannel
                for (const blockedChannel in blockedChannels) {
                    const channel = guild.channels.cache.find(chnl => chnl.id === blockedChannel)
                    if (!channel || !message.channel.id(chnl.id)) {
                        tempMsg(message.channel, `${language(guild, "PERMISSION_BLOCKEDCHANNEL")}`, 10)
                        return
                    }
                }

                // Ensure the user has not ran this command too frequently
                let cooldownString = `${guild.id}-${member.id}-${commands[0]}`
                if (cooldown > 0 && recentlyRan.includes(cooldownString)) {
                    tempMsg(message.channel, `${language(guild, 'PERMISSION_COOLDOWN')}`, 10)
                    return
                }

                // Split on any number of spaces
                const args = content.split(/[ ]+/)
                // Remove the command which is the first index
                args.shift()
                // Ensure correct number of arguments
                if (args.length < minArgs || (
                    maxArgs !== null && args.length > maxArgs
                )) {
                    tempMsg(message.channel, `Incorrect syntax. Use ${prefix}${alias} ${expectedArgs}`, 10)
                    return
                }

                if (cooldown > 0) {
                    recentlyRan.push(cooldownString)
                    setTimeout(() => {
                        recentlyRan = recentlyRan.filter((string) => {
                            return string !== cooldownString
                        })
                    }, 1000 * cooldown)
                }
                

                // Handle the custom command code
                callback(client, message, args, args.join(' '))
                return
            }
        }
    })
}
module.exports.updateCache = (guildId, newPrefix) => {
    guildPrefixes[guildId] = newPrefix
}


module.exports.loadPrefixes = async (client) => {
    await mongo().then(async (mongoose) => {
        try {
            for (const guild of client.guilds.cache) {
                const guildId = guild[1].id

                const result = await commandPrefixSchema.findOne({ _id: guildId })
                guildPrefixes[guildId] = result ? result.prefix : globalPrefix
            }
            console.log(guildPrefixes)
        } finally {
            mongoose.connection.close()
        }
    })
}*/