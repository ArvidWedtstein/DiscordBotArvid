const fs = require('fs');
const Discord = require('discord.js');
const { MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons')
const firstMessage = require('./first-message')
module.exports = (client) => {
        const channelId = '719822613932671020'
        const getEmoji = emojiName => client.emojis.cache.find((emoji) => emoji.name === emojiName)
    
        // Emoji: 'Role Name'
        const emojis = {
            Android: 'Android',
            iOS: 'Apple',
            MacOS: 'MacOS',
            Windows: 'Windows',
            Ubuntu: 'Ubuntu'
        }

        const reactions = []

        let emojiText = 'Add a reaction to claim a role\nReact only to the operation system that you use\n\n'

        for (const key in emojis) {
            const emoji = getEmoji(key)
            reactions.push(emoji)

            const role = emojis[key]
            emojiText += `${emoji} = ${role}\n`
        }
        let options1 = new MessageMenuOption()
            .setLabel('Android')
            .setValue("1")
            .setDefault()
            .setEmoji("719823522335293504")
        let options2 = new MessageMenuOption()
            .setLabel('Apple')
            .setValue("2")
            .setDefault()
            .setEmoji("719823506014994448")
        let options3 = new MessageMenuOption()
            .setLabel('MacOS')
            .setValue("3")
            .setDefault()
            .setEmoji("836906360040849438")
        let options4 = new MessageMenuOption()
            .setLabel('Windows')
            .setValue("4")
            .setDefault()
            .setEmoji("860224790656319489")
        let options5 = new MessageMenuOption()
            .setLabel('Ubuntu')
            .setValue("5")
            .setDefault()
            .setEmoji("836906399991988227")
        let select = new MessageMenu()
            .setID('Shop')
            .setMaxValues('2')
            .setMinValues('1')
            .setPlaceholder('Select Item')  
            .addOptions([options1, options2, options3, options4, options5])

        firstMessage(client, channelId, emojiText, reactions, select)
        /*let msg = await message.channel.send(emojiText)
            for (const react in reactions) {
                msg.react(reactions[react])
            }
        */
        const handleReaction = (reaction, user, add) => {
            if (user.bot) {
                return;
            }

            const emoji = reaction._emoji.name

            const { guild } = reaction.message

            const roleName = emojis[emoji]
            if (!roleName) {
                return;
            }

            const role = guild.roles.cache.find(role => role.name === roleName)
            const member = guild.members.cache.find(member => member.id === user.id)
            if (add) {
                member.roles.add(role)
            } else {
                member.roles.remove(role)
            }
        }
        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == channelId) {
                handleReaction(reaction, user, true)
            } else {
                return;
            }
        });
        

        client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == channelId) {
                handleReaction(reaction, user, false)
            } else {
                return;
            }
    });
}
