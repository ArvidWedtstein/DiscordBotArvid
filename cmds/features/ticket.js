const settings = require('../features/setting')
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando');
const tempMsg = require('../misc/temporary-message')
const commandStats = require('../../Stats/commandStats')
module.exports = class TicketCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'ticket',
            aliases: ['support'],
            group: 'features',
            memberName: 'ticket',
            description: 'send a ticket',
            argsType: 'multiple',
            guildOnly: true,
            throttling: {
				usages: 1,
				duration: 30,
			},
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'ticket')
        message.delete()

        const setting = await settings.setting(message, 'ticket');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Ticket ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            let channel = message.member.guild.channels.cache.find(channel => channel.name === 'tickets');
            if (!channel) {
                const name = 'tickets'
                message.guild.channels
                    .create(name, {
                        type: 'text',
                    })
                channel = message.member.guild.channels.cache.find(channel => channel.name === 'tickets');
            }
            const check = '<:yes:807175712515162183>'
            let helpText = args.slice(0).join(' ');
            var d = new Date();
    
            //If there is no help
            if (!helpText) {
                return message.reply(`${language(guild, 'TICKET_NOARGS')}`)
                //helpText = 'No help needed.';
            }
    
            if (helpText.length > 1024) {
                helpText = helpText.slice(0, 1021) + '...';
            }
            const { member } = message
            let embed = new Discord.MessageEmbed()
                .setColor('ff0000')
                .setTitle(`${language(guild, 'TICKET_ISSUE')}:`)
                .setDescription(helpText)
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setFooter(`${language(guild, 'TICKET_UNSOLVED')} ${d.toLocaleTimeString()}`)
            let messageEmbed = await channel.send(embed).then((message) => {
                message.react(check);
    
                this.client.on('messageReactionAdd', async (reaction, user) => {
                    if (reaction.message.partial) await reaction.message.fetch();
                    if (reaction.partial) await reaction.fetch();
                    if (user.bot) return;
                    if (!reaction.message.guild) return;
                    const ReactUser = reaction.message.guild.members.cache.get(user.username)
                    let embed2 = new Discord.MessageEmbed()
                        .setColor('10ff00')
                        .setTitle(`${language(guild, 'TICKET_SOLVED')} ${language(guild, 'TICKET_ISSUE')}:`)
                        .setDescription(helpText)
                        .setAuthor(member.user.username, member.user.displayAvatarURL())
                        .setTimestamp()
                        .setFooter(`${language(guild, 'TICKET_SOLVEDBY')} ${user.username}`)
                    reaction.message.edit(embed2);
                    member.user.send(`${language(guild, 'TICKET_SOLVEDISSUE')} ${user.username}`)
                    
                });
                this.client.on('messageReactionRemove', async (reaction, user) => {
                    if (reaction.message.partial) await reaction.message.fetch();
                    if (reaction.partial) await reaction.fetch();
                    if (user.bot) return;
                    if (!reaction.message.guild) return;
        
                    const ReactUser = reaction.message.guild.members.cache.get(user.username)
                    let embed = new Discord.MessageEmbed()
                        .setColor('ff0000')
                        .setTitle(`${language(guild, 'TICKET_ISSUE')}:`)
                        .setDescription(helpText)
                        .setAuthor(member.user.username, member.user.displayAvatarURL())
                        .setFooter(`${language(guild, 'TICKET_UNSOLVED')} ${d.toLocaleTimeString()}`)
                    message.edit(embed);
                    member.user.send(`${language(guild, 'TICKET_UNSOLVEDISSUE')}`)
                });
            })
        }
    }
}