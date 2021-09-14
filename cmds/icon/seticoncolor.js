const colors = require('./icons.json')
const settingsSchema = require('../../schemas/settings-schema')
const tempMsg = require('../misc/temporary-message');
const config = require('../../config.json')
const { MessageMenuOption, MessageMenu, MessageActionRow, MessageButton } = require('discord-buttons');
const Discord = require('discord.js');
const { setColor }  = require('./icon')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class SetLanguageCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'seticoncolor',
            aliases: ['seticon', 'sic'],
            group: 'icon',
            memberName: 'seticoncolor',
            description: 'set server icon color',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR']
        })
    }

    async run(message, args) {
        message.delete()
        
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, this.name)
        const btns = []
        for (let i = 0; i < colors.colors.length; i++) {
            let col = new MessageButton()
                .setEmoji(colors[colors.colors[i]].checkmark)
                .setLabel(colors.colors[i])
                .setStyle(3)
                .setID(i)
            btns.push(col)
        }

        const close = new MessageButton()
            .setEmoji('❌')
            .setStyle(1)
            .setID('close')
        let embed = new Discord.MessageEmbed()
        .setColor(config.botEmbedHex)
        .setTitle(`Color`)
        .setDescription(`Select Color`)

        let messageEmbed = await message.channel.send({
            embed: embed,
            buttons: btns
        });


        this.client.on('clickButton', async (btn) => {
            
            switch (btn.id) {
                case "0":
                    let embedBlue = new Discord.MessageEmbed()
                    .setTitle(`Color`)
                    .setDescription(`Color set to Blue`)
                    let messageEmbedDE = await messageEmbed.edit({
                        embed: embedBlue,
                        buttons: [close]
                    });
                    setColor(guild, 'blue')
                    await settingsSchema.findOneAndUpdate({
                        guildId: guild.id
                    }, {
                        guildId: guild.id,
                        iconcolor: 'blue'
                    }, {
                        upsert: true
                    })
                    btn.reply.defer()
                    break;                    
                case "1":
                    let embedRed = new Discord.MessageEmbed()
                    .setTitle(`Language`)
                    .setDescription(`Color set to Red`)

                    let messageEmbedRed = await messageEmbed.edit({
                        embed: embedRed,
                        buttons: [close]
                    });

                    setColor(guild, 'red')

                    await settingsSchema.findOneAndUpdate({
                        guildId: guild.id
                    }, {
                        guildId: guild.id,
                        iconcolor: 'red'
                    }, {
                        upsert: true
                    })
                    btn.reply.defer()
                    break;
                case "2":
                    let embedPurple = new Discord.MessageEmbed()
                    .setTitle(`Language`)
                    .setDescription(`Language set to Purple`)
                    
                    let messageEmbedPurple = await messageEmbed.edit({
                        embed: embedPurple,
                        buttons: [close]
                    });

                    setColor(guild, 'purple')

                    await settingsSchema.findOneAndUpdate({
                        guildId: guild.id
                    }, {
                        guildId: guild.id,
                        iconcolor: 'purple'
                    }, {
                        upsert: true
                    })
                    btn.reply.defer()
                    break;
                case "3": 
                    let embedYellow = new Discord.MessageEmbed()
                    .setTitle(`Color`)
                    .setDescription(`Language set to Yellow`)
                    
                    let messageEmbedYellow = await messageEmbed.edit({
                        embed: embedYellow,
                        buttons: [close]
                    });

                    setColor(guild, 'yellow')

                    await settingsSchema.findOneAndUpdate({
                        guildId: guild.id
                    }, {
                        guildId: guild.id,
                        iconcolor: 'yellow'
                    }, {
                        upsert: true
                    })
                    btn.reply.defer()
                    break;
            case "close": 
                    messageEmbed.delete()
                    btn.reply.defer()
                    break;
            }
                
        });

        /*const targetLanguage = args[0].toLowerCase()
        if (!languages.includes(targetLanguage)) {
            tempMsg(message.channel, 'That language is not supported.', 10)
            return
        }*/
    }
}