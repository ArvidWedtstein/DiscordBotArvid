const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const icons = require('../icon/icon')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
const gamenpm = require('../test/gamenpm')
module.exports = class GameCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'gamecount',
            aliases: ['gamemembers'],
            group: 'features',
            memberName: 'gamecount',
            description: 'check how many players want to play a game',
            userPermissions: ['ADD_REACTIONS'],
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
            guarded: false
        })
    }

    async run(message, args) {
        message.delete();
        const getEmoji = emojiName => {
            return icons(guild, emojiName)
        }
        const { guild, channel } = message;
        const guildId = message.guild.id;
        commandStats.cmdUse(guildId, `${this.name}`);


        gamenpm.create_game(message, 'SCP: SECRET LABORATORY', '<:yes:807175712515162183>', 10000, "ff0000")
        /*const game = args.join(' ');
        let i = 0;
        let embed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription(`${game}\n\nCurrent Members: ${i}\n\nPress ${icons(guild, 'checkmark')} if you want to join`)
            .setTimestamp()
        let messageEmbed = await message.channel.send(embed)
        messageEmbed.react(getEmoji('checkmark'))
        let membersjoined = []
        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == channel.id) {
                i++;
                
                const member = guild.members.cache.get(user.id)
                membersjoined.push(member.user.username)
                let embed2 = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setDescription(`${game}\n\nCurrent Members: ${i}\n\nPress ${icons(guild, 'checkmark')} if you want to join`)
                for (let x = 0; x < membersjoined.length; x++) {
                    embed2.addField(membersjoined[x], '👍', true)
                }

                messageEmbed = await messageEmbed.edit(embed2);
            } else {
                return;
            }
        });
        this.client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == channel.id) {
                i--;
                const member = guild.members.cache.get(user.id)
                membersjoined = membersjoined.filter(item => item !== member.user.username)
                let embed3 = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setDescription(`${game}\n\nCurrent Members: ${i}\n\nPress ${icons(guild, 'checkmark')} if you want to join`)
                for (let x = 0; x < membersjoined.length; x++) {
                    embed3.addField(membersjoined[x], '👍', true)
                }
                messageEmbed = await messageEmbed.edit(embed3);
            } else {
                return;
            }
        });*/
    }
}