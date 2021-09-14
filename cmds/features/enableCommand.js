const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
module.exports = class EnableCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'enable',
            aliases: ['activate'],
            group: 'features',
            memberName: 'enable',
            description: 'enable a command',
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
                        c.setEnabledIn(guild, true)
                        let embed = new Discord.MessageEmbed()
                            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
                            .setTitle(`Enabled the ${c.name} command`)
                            .setColor('#00ff00')
                        tempMsg(message.channel, embed, 30)
                    }
                })
            })
        }
    }
}