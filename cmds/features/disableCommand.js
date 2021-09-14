const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
module.exports = class DisableCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'disable',
            aliases: ['deactivate'],
            group: 'features',
            memberName: 'disable',
            description: 'disable a command',
            details: 'this command disables the command you wish to disable',
            userPermissions: ['ADMINISTRATOR'],
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
            guildOnly: true,
            guarded: true
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id;
        commandStats.cmdUse(guildId, `${this.name}`);
        const cmds = []
        this.client.registry.groups.forEach((e) => {
            e.commands.forEach((c) => {
                cmds.push(c.name)
            })
        })
        if (!cmds.includes(args[0])) {
            tempMsg(message.channel, `Invalid command`, 30)
        } else {
            this.client.registry.groups.forEach((e) => {
                e.commands.forEach((c) => {
                    if (c.name === args[0]) {
                        if (c.hidden) return;
                        if (!c.guarded) {
                            c.setEnabledIn(guild, false)
                            let embed = new Discord.MessageEmbed()
                                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
                                .setTitle(`Disabled the ${c.name} command`)
                                .setColor('#ff0000')
                            tempMsg(message.channel, embed, 30)
                        } else {
                            tempMsg(message.channel, `${language(guild, 'COMMAND_GUARDED')}`)
                        }
                    }
                })
            })
        }
    }
}