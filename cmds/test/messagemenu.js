const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const emojiCharacters = require('../reaction/emojiCharacters')
const commandStats = require('../../Stats/commandStats')
const { MessageActionRow, MessageComponent, MessageButton, MessageMenu, MessageMenuOption} = require('discord-buttons');
module.exports = class MsgMenuCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'menu',
            aliases: ['msgmenu'],
            group: 'test',
            memberName: 'menu',
            description: 'test',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        const test = {
            test1: '1',
            test2: '2',
            test3: '3'
        }
        const options = []
        for (let keys in test) {
            let role = new MessageMenuOption()
                .setLabel(test[keys])
                .setValue(keys)
            options.push(role)
        }
        const Menu = new MessageMenu()
            .setID('Menu')
            .setPlaceholder('select')
            .addOptions(options)
            .setMaxValues(3)
            .setMinValues(1)
        
        message.channel.send('** **', Menu)
        commandStats.cmdUse(guildId, 'menu')
        const emojis = guild.emojis.cache
        .map((e) => `"${e.name}": "${e.id}"`)
        .join(',\n');
        //await message.channel.send(emojis)

        const em = emojis.split(',')
        let yr = ''
        let br = ''
        let rr = ''
        let pr = ''
        for (let i = 0; i < em.length; i++) {
            if (em[i].includes('yellow')) {
                yr += `${em[i]},`
            } else if (em[i].includes('blue')) {
                br += `${em[i]},`
            } else if (em[i].includes('red')) {
                rr += `${em[i]},`
            } else if (em[i].includes('purple')) {
                pr += `${em[i]},`
            } 
        }

        message.channel.send(yr + '\n')
        message.channel.send(br + '\n')
        message.channel.send(rr + '\n')
        message.channel.send(pr + '\n')
            
    }
}