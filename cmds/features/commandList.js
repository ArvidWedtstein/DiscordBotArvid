const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
module.exports = class CommandListCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'commands',
            aliases: ['commandlist', 'kommandoer'],
            group: 'features',
            memberName: 'commands list',
            description: 'list all commands',
            userPermissions: ['SEND_MESSAGES'],
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
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id;
        commandStats.cmdUse(guildId, `${this.name}`);
        const cmdstate = []
        this.client.registry.groups.forEach((e) => {
            e.commands.forEach((c) => {
                if (c.hidden) return
                if (c.ownerOnly) return
                if (c.guarded) {
                    cmdstate.push({name: c.name, state: `${c.isEnabledIn(guild)} ${boticons(this.client, 'secure')}`})
                } else {
                    cmdstate.push({name: c.name, state: `${c.isEnabledIn(guild)}`})
                }
            })
        })

        let txt = 'Commands:\n\n'
        for (let command in cmdstate) {
            txt += `**Command** | **Is Enabled**\n`
            txt += `${cmdstate[command].name}: ${cmdstate[command].state}\n`
        }

        await message.reply(txt)
    }
}