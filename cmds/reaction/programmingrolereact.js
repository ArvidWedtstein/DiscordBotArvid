const fs = require('fs');
const Discord = require('discord.js');
const firstMessage = require('./first-message')
module.exports = (client) => {
        const channelId = '834403748914790401'

        const getEmoji = emojiName => client.emojis.cache.find((emoji) => emoji.name === emojiName)

        const emojis = {
            JavaScript: 'JavaScript',
            Python: 'Python',
            VisualBasic: 'VisualBasic',
            Java: 'Java',
            Csharp: 'C#',
            BrainFuck: 'BrainFuck',
            HTML: 'HTML',
            CSS: 'CSS'
        }

        const reactions = []

        let emojiText = 'Add a reaction to claim a role\nReact only to the programming languages that you use\n\n'

        for (const key in emojis) {
            const emoji = getEmoji(key)
            reactions.push(emoji)

            const role = emojis[key]
            emojiText += `${emoji} = ${role}\n`
        }


        firstMessage(client, channelId, emojiText, reactions)
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
