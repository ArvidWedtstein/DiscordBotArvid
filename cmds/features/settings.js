const settingsSchema = require('../../schemas/settings-schema');
const config = require('../../config.json');
const fs = require('fs');
const Discord = require('discord.js');
const { MessageButton } = require('discord-buttons')
const language = require('../language/language')
const Commando = require('discord.js-commando');
const setting = require('./setting')
const emojicharacters = require('../reaction/emojiCharacters')
const boticons = require('../reaction/boticons')
const icons = require('../icon/icon')
const commandStats = require('../../Stats/commandStats')
module.exports = class SettingsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            aliases: ['einstellungen'],
            group: 'features',
            memberName: 'settings',
            description: 'settings',
            details: 'toggle on or off various settings',
            userPermissions: ['ADMINISTRATOR'],
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
        const { guild } =  message
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'settings')
        message.delete()
        
        
        const desc = {
            1: `${language(guild, 'EMOTE_SYSTEM')}`,
            2: `${language(guild, 'ECONOMY_SYSTEM')}`,
            3: `${language(guild, 'SWEARFILTER_SYSTEM')}`,
            4: `${language(guild, 'TICKET_SYSTEM')}`,
            5: `${language(guild, 'MODERATION_SYSTEM')}`,
            6: `${language(guild, 'ANTIJOIN_SYSTEM')}`,
            7: `${language(guild, 'WELCOME_SYSTEM')}`
        }
        let page = 0;
        const settingicon = icons(guild, 'settings');
        const off = boticons(this.client, 'off');
        const on = boticons(this.client, 'on');
        const sign = boticons(this.client, 'sign')
        let msg = `${emojicharacters['0-3']} ${sign} This page\n
        ${emojicharacters['1-3']} ${sign} Emote ${language(guild, 'SETTINGS')}\n
        ${emojicharacters['2-3']} ${sign} Economy ${language(guild, 'SETTINGS')}\n
        ${emojicharacters['3-3']} ${sign} Swearfilter ${language(guild, 'SETTINGS')}\n
        ${emojicharacters['4-3']} ${sign} Ticket ${language(guild, 'SETTINGS')}\n
        ${emojicharacters['5-3']} ${sign} Moderation ${language(guild, 'SETTINGS')}\n
        ${emojicharacters['6-3']} ${sign} Antijoin ${language(guild, 'SETTINGS')}\n
        ${emojicharacters['7-3']} ${sign} Welcome Message ${language(guild, 'SETTINGS')}`

        /*const offbutton = new MessageButton()
            .setStyle('red')
            .setLabel('Off')
            .setEmoji(`${off.id}`)
            .setID('off')
        const onbutton = new MessageButton()
            .setStyle('green')
            .setLabel('On')
            .setEmoji(`${on.id}`)
            .setID('on')*/
        
        let embed = new Discord.MessageEmbed()
            .setColor(config.botEmbedHex)
            .setTitle(`${emojicharacters['archleft']}${capitalizeFirstLetter(language(guild, 'SETTINGS'))}${emojicharacters['archright']}`)
            .setDescription(`${settingicon} ${language(guild, 'SETTINGS_DESC')}\n\n\n${msg}`)
            .setFooter(`${language(guild, 'HELP_PAGE')} - ${page}/7`)
        let messageEmbed = await message.channel.send(embed);
        messageEmbed.react(icons(guild, 'chevronleft'));
        messageEmbed.react(icons(guild, 'chevronright'));
        /*for (let i = 0; i < 6; i++) {
            messageEmbed.react(nmb[i])
        }*/
        async function updateEmbed(color, category, emojis = [], toggleemoji, pageint) {
            let embed2 = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${capitalizeFirstLetter(category)} system ${language(guild, 'SETTINGS')} ${toggleemoji}`)
                .setDescription(`${language(guild, 'SETTINGS_REACT')} ${capitalizeFirstLetter(category)} system\n__${desc[pageint]}__`)
                .setFooter(`${language(guild, 'HELP_PAGE')} - ${pageint}/7`)
            let messageEmbeds = await messageEmbed.edit(embed2);
            
            //messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            
            
            for (let i = 0; i < emojis.length; i++) {
                messageEmbed.react(emojis[i]);
            }
        }

        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            if (user != message.author) {
                await reaction.users.remove(user.id);
                return
            }
            let emojis = []
            if (reaction.message.channel.id == message.channel.id) {
                if (reaction.message.id != messageEmbed.id) return
                let result = await settingsSchema.findOne({
                    guildId
                })

                if (!result) {
                    //console.log('new settings schema')
                    result = await new settingsSchema({
                        guildId
                    }).save()
                    /*result = await settingsSchema.findOne({
                        guildId
                    })*/
                    return
                }
                messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                if (reaction.emoji.id == icons(guild, 'chevronleft')) {
                    if (page == 0) {     
                        page = 7
                    } else {
                        page -= 1
                    }
                } else if (reaction.emoji.id == icons(guild, 'chevronright')) {
                    if (page == 7) {
                        page = 0
                    } else {
                        page += 1
                    }
                } else if (reaction.emoji.id == off) {
                    emojis = [icons(guild, 'chevronleft'), icons(guild, 'chevronright'), on]
                    //emojis = [trueEmoji]
                    //await reaction.message.reactions.valueOf(off).delete()
                    //reaction.message.reactions.resolve(off).users.remove(this.client.id)
                    
                    await reaction.users.remove(this.client.id);
                    if (page == 1) {
                        updateEmbed(config.botFalseHex, 'Emote', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    emotes: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 2) {
                        updateEmbed(config.botFalseHex, 'Economy', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    money: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 3) {
                        updateEmbed(config.botFalseHex, 'Swearfilter', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    swearfilter: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 4) {
                        updateEmbed(config.botFalseHex, 'Ticket', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    ticket: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 5) {
                        updateEmbed(config.botFalseHex, 'Moderation', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    moderation: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 6) {
                        updateEmbed(config.botFalseHex, 'Antijoin', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    antijoin: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 7) {
                        updateEmbed(config.botFalseHex, 'Welcome', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    welcome: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    }
                } else if (reaction.emoji.id == on) {
                    emojis = [icons(guild, 'chevronleft'), icons(guild, 'chevronright'), off]
                    //emojis = [falseEmoji]
                    await reaction.users.remove(this.client.id);
                    
                    if (page == 1) {
                        updateEmbed(config.botTrueHex, 'Emote', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    emotes: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 2) {
                        updateEmbed(config.botTrueHex, 'Economy', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    money: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 3) {
                        updateEmbed(config.botTrueHex, 'Swearfilter', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    swearfilter: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 4) {
                        updateEmbed(config.botTrueHex, 'Ticket', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    ticket: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 5) {
                        updateEmbed(config.botTrueHex, 'Moderation', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    moderation: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 6) {
                        updateEmbed(config.botTrueHex, 'Antijoin', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    antijoin: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 7) {
                        updateEmbed(config.botTrueHex, 'Welcome', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    welcome: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    }
                }
                result = await settingsSchema.findOne({
                    guildId
                })
                const categories = {
                    moderation: result.moderation,
                    ticket: result.ticket,
                    swearfilter: result.swearfilter,
                    emotes: result.emotes,
                    money: result.money,
                    currency: result.currency,
                    antijoin: result.antijoin,
                    welcome: result.welcome
                }
                let category = ''
                
                switch (page) {
                    case 0:
                        messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                        embed = new Discord.MessageEmbed()
                            .setColor(config.botEmbedHex)
                            .setTitle(`${emojicharacters['archleft']}${capitalizeFirstLetter(language(guild, 'SETTINGS'))}${emojicharacters['archright']}`)
                            .setDescription(`${settingicon} ${language(guild, 'SETTINGS_DESC')}\n\n\n${msg}`)
                            .setFooter(`${language(guild, 'HELP_PAGE')} - ${page}/7`)
                        await messageEmbed.edit(embed);
                        
                        messageEmbed.react(icons(guild, 'chevronleft'))
                        messageEmbed.react(icons(guild, 'chevronright'))
                        //await reaction.users.remove(user.id);
                        //reaction.message.reactions.valueOf(2).delete()
                        break;
                    case 1:
                        category = 'emotes'
                        break;
                    case 2:
                        category = 'money'
                        break;
                    case 3:
                        category = 'swearfilter'
                        break;
                    case 4:
                        category = 'ticket'
                        break;
                    case 5:
                        category = 'moderation'
                        break;
                    case 6:
                        category = 'antijoin'
                        break;
                    case 7:
                        category = 'welcome'
                        break;
                }
                for (const key in categories) {
                    if (category == key) {
                        if (categories[key] == true) {
                            emojis = [icons(guild, 'chevronleft'), icons(guild, 'chevronright'), off]
                            updateEmbed(config.botTrueHex, `${category}`, emojis, on, page)
                        } else if (categories[key] == false) {
                            emojis = [icons(guild, 'chevronleft'), icons(guild, 'chevronright'), on]
                            updateEmbed(config.botFalseHex, `${category}`, emojis, off, page)
                        }
                        await reaction.users.remove(user.id);
                    }
                }
                return
            } else {
                return;
            }
        });
    }
}
