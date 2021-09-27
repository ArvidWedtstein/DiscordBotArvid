const memberCounter = require('../../Stats/memberCounter');
const language = require('../language/language')
const fs = require('fs');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js')
const Commando = require('discord.js-commando')
const economy = require('../../economy')
const tempmsg = require('../misc/temporary-message');
const { MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons')
const icons = require('../icon/icon')
const commandStats = require('../../Stats/commandStats');
const emojiCharacters = require('../reaction/emojiCharacters');
const boticons = require('../reaction/boticons');
module.exports = class HelpCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['hilfe', 'hjelp', 'h', 'memehelp'],
            group: 'features',
            memberName: 'help',
            description: `꧁༺get help about commandos༻꧂`,
            argsType: 'multiple',
            guildOnly: true,
            format: 'help',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            userPermissions: ['SEND_MESSAGES'],
            examples: ['help <commando>'],
            guarded: true
        })
    
    }

    async run(message, args) {
        /*const next = new MessageButton()
            .setLabel('>')
            .setStyle(1)
            .setID('2')
        const prev = new MessageButton()
            .setLabel('<')
            .setStyle(1)
            .setID('1')*/
        const cmd = []
        const cmddetails = []
        const cmddescription = []
        const cmdexamples = [];
        const { guild, author } = message
        const guildId = guild.id
        const userId = author.id;

        commandStats.cmdUse(guildId, 'help')
        
        const getEmoji = emojiName => {
            return icons(guild, emojiName)
        }
        
        let color = await economy.getColor(guildId, userId);
        if (args[0]) {
            this.client.registry.groups.forEach((g) => {
                g.commands.forEach((c) => {
                    if (!c.hidden) {
                        cmd.push(c.name)
                        cmddescription.push(c.description)
                        cmddetails.push(c.details)
                        if (c.examples.length > 0) {
                            cmdexamples.push(c.examples);
                        }
                    }
                })
            })
            
            if (!cmd.includes(args[0])) return
            let embed = new Discord.MessageEmbed()
                .setTitle(`${getEmoji("help")} ${language(guild, 'HELP_TITLE')} - ${cmd[cmd.indexOf(args[0])]}`)
                if (!cmddetails[cmd.indexOf(args[0])]) {
                    embed.setDescription(`${cmddescription[cmd.indexOf(args[0])]}`)
                } else {
                    embed.setDescription(`${cmddetails[cmd.indexOf(args[0])]}`)
                }
                
            let messageEmbed = message.channel.send(embed);
            return
        }
        const emptyarray = arr => arr.length = 0;
        
    


      
        const categorie = []
        this.client.registry.groups.forEach((g) => {
            categorie.push(g.id)
        })
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        //const ticket = this.client.registry.findCommands('ticket')
        const remove = ['test', 'prefix']
        const categories = categorie.filter(item => !remove.includes(item)).sort()
        //const getEmoji = emojiName => this.client.emojis.cache.find((emoji) => emoji.id === emojiName)
        const options = []
        let catoption = new MessageMenuOption()
            .setLabel('Home')
            .setValue(0)
            .setDescription(`Overview over the categories`)
        options.push(catoption)
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`${getEmoji("help")} ${emojiCharacters.squareleft}${language(guild, 'HELP_TITLE')}${emojiCharacters.squareright}`)
            .setDescription(`${boticons(this.client, 'ticket')}${language(guild, 'HELP_TICKET')} `)
            .setFooter(`${language(guild, 'HELP_PAGE')} - 0/${categories.length}`)
            .addFields(
                {name: '__**' + 0 + '**__', value: 'This page', inline: true},
            )
            for (let i = 0; i < categories.length; i++) {
                let role = new MessageMenuOption()
                    .setLabel(capitalizeFirstLetter(categories[i]))
                    .setValue(i + 1)
                    .setDescription(`${language(guild, 'HELP_LIST')} ${categories[i]} commands`)
                options.push(role)
                embed.addField('__**' + `${capitalizeFirstLetter(categories[i])}` + ` - ${i + 1}` + '**__', `${language(guild, 'HELP_LIST')} ${categories[i]} commands`, true)
            }
        //let messageEmbed = await message.channel.send(embed);
        const Menu = new MessageMenu()
            .setID('Menu')
            .setPlaceholder('Select Category')
            .addOptions(options)
            .setMaxValues(1)
            .setMinValues(1)

        let messageEmbed = await message.channel.send({
            //buttons: [prev, next], 
            component: Menu,
            embed: embed 
        });
        async function helpembed (title, description, page, contentname, contentvalue, contentalias, contentexample) {
            let embedMain = new Discord.MessageEmbed()
                .setTitle(`${getEmoji("help")} ${title} - ${capitalizeFirstLetter(description)}`)
                .setColor(color)
                .setFooter(`${language(guild, 'HELP_PAGE')} ${page}/${categories.length}`)
            
                for (let i = 0; i < contentname.length; i++) {
                    //embedMain.addField('> ' + contentname[i], `${contentvalue[i]} ${contentexample[i]}`, true)
                    embedMain.addField('> ' + contentname[i], `${contentvalue[i]}`, true)
                }
                //embedMain.setDescription(`${cmds}`)
            await messageEmbed.edit(embedMain);
            /*return await messageEmbed.edit({
                buttons: [prev, next],
                embed: embedMain
            });*/
        }
        let page = 0;
        /*this.client.on('clickButton', async (btn) => {
            if (btn.id == 1) {
                if (page == 0) {     
                    page = categories.length
                } else {
                    page -= 1
                }
            } else if (btn.id == 2) {
                if (page > categories.length - 1) {
                    page = 0
                } else {
                    page += 1
                }
            }
            if (page === '0') {
                let embed2 = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${getEmoji("help")} ${language(guild, 'HELP_TITLE')}`)
                .setDescription(`${language(guild, 'HELP_TICKET')}`)
                .setFooter(`${language(guild, 'HELP_PAGE')} 0/${categories.length}`)
                .addFields(
                    {name: 0, value: 'This page'},
                )
                for (let i = 0; i < categories.length; i++) {
                    embed.addField(i + 1, `${language(guild, 'HELP_LIST')} ${categories[i]} commands`)
                }
                await messageEmbed.edit(embed2);
            } else {
                emptyarray(contentname);
                emptyarray(contentvalue);
                emptyarray(contentalias);
                this.client.registry.groups.forEach((e) => {
                    if (e.id === categories[page - 1]) {
                        e.commands.forEach((c) => {
                            let requiredperms = c.userPermissions;
                            if (c.ownerOnly && !this.client.isOwner(message.member.user)) {
                                return;
                            }
                            if (c.userPermissions) {
                                //console.log(message.member.user.username, requiredperms, message.member.permissions.has(requiredperms))
                                if (message.member.permissions.has(requiredperms)) {
                                    contentname.push(c.name)
                                    contentvalue.push(c.description)
                                    contentalias.push(c.aliases)
                                }
                            } else {
                                contentname.push(c.name)
                                contentvalue.push(c.description)
                                contentalias.push(c.aliases)
                            }
                        })
                        helpembed(language(guild, 'HELP_TITLE'), `${categories[page - 1]}`, page, contentname, contentvalue, contentalias)
                    }
                })
            }
        })*/

        this.client.on('clickMenu', async (m) => {
            //m.reply.defer();
            page = m.values[0].toString()
            // console.log(page)
            if (page == '0') {
                // console.log('home page')
                let embedhom = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`${getEmoji("help")} ${emojiCharacters.squareleft}${language(guild, 'HELP_TITLE')}${emojiCharacters.squareright}`)
                    .setDescription(`${language(guild, 'HELP_TICKET')} `)
                    .setFooter(`${language(guild, 'HELP_PAGE')} - 0/${categories.length}`)
                    .addFields(
                        {name: '__**' + 0 + 'Home' + '**__', value: 'This page', inline: true},
                    )
                    for (let i = 0; i < categories.length; i++) {
                        embedhom.addField('__**' + `${capitalizeFirstLetter(categories[i])}` + ` - ${i + 1}` + '**__', `${language(guild, 'HELP_LIST')} ${categories[i]} commands`, true)
                    }

                await messageEmbed.edit(embedhom)
                
            } else {
                emptyarray(contentname);
                emptyarray(contentvalue);
                emptyarray(contentalias);
                emptyarray(contentexample);
                this.client.registry.groups.forEach((e) => {
                    if (e.id === categories[page - 1]) {
                        e.commands.forEach((c) => {
                            let requiredperms = c.userPermissions;
                            if (c.ownerOnly && !this.client.isOwner(message.member.user)) {
                                return;
                            }
                            if (c.userPermissions) {

                                //console.log(message.member.user.username, requiredperms, message.member.permissions.has(requiredperms))
                                if (m.clicker.member.permissions.has(requiredperms)) {
                                    if (!c.hidden) {
                                        contentname.push(c.name)
                                        contentvalue.push(c.description)
                                        contentalias.push(c.aliases)
                                        contentexample.push(c.examples);
                                    }
                                }
                            } else {
                                /*contentname.push(c.name)
                                contentvalue.push(c.description)
                                contentalias.push(c.aliases)
                                contentexample.push(c.examples);*/
                            }
                        })
                        helpembed(language(guild, 'HELP_TITLE'), `${categories[page - 1]}`, page, contentname, contentvalue, contentalias, contentexample)
                    }
                })
            }
        })
        messageEmbed.react(getEmoji('chevronleft'));
        messageEmbed.react(getEmoji('chevronright'));
        let contentname = []
        let contentvalue = []
        let contentalias = []
        let contentexample = []
        
        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            if (reaction.message.id != messageEmbed.id) return
            if (reaction.message.channel.id == message.channel.id) {
                await reaction.users.remove(user.id);
                page = Number(page)
                if (reaction.emoji.id == getEmoji('chevronleft')) {
                    if (page == 0) {     
                        page = categories.length
                    } else {
                        page -= 1
                    }
                } else if (reaction.emoji.id == getEmoji('chevronright')) {
                    if (page > categories.length - 1) {
                        page = 0
                    } else {
                        page += 1
                    }
                }
                if (page == '0') {
                    emptyarray(contentname);
                    emptyarray(contentvalue);
                    emptyarray(contentalias);
                    emptyarray(contentexample);
                    let embed2 = new Discord.MessageEmbed()
                        .setColor(color)
                        .setTitle(`${getEmoji("help")} ${emojiCharacters.squareleft}${language(guild, 'HELP_TITLE')}${emojiCharacters.squareright}`)
                        .setDescription(`${language(guild, 'HELP_TICKET')}`)
                        .setFooter(`${language(guild, 'HELP_PAGE')} - ${page}/${categories.length}`)
                        .addFields(
                            {name: '__**' + 0 + '**__', value: 'This page', inline: true},
                        )
                        for (let i = 0; i < categories.length; i++) {
                            embed2.addField('__**' + `${capitalizeFirstLetter(categories[i])}` + ` - ${i + 1}` + '**__', `${language(guild, 'HELP_LIST')} ${categories[i]} commands`, true)
                        }
                    await messageEmbed.edit(embed2);
                    return
                } else {
                    emptyarray(contentname);
                    emptyarray(contentvalue);
                    emptyarray(contentalias);
                    emptyarray(contentexample);
                    this.client.registry.groups.forEach((e) => {
                        if (e.id === categories[page - 1]) {
                            e.commands.forEach((c) => {
                                let requiredperms = c.userPermissions;
                                if (c.ownerOnly && !this.client.isOwner(message.member.user)) {
                                    return;
                                }
                                if (c.userPermissions) {
                                    //console.log(message.member.user.username, requiredperms, message.member.permissions.has(requiredperms))
                                    if (message.member.permissions.has(requiredperms)) {
                                        contentname.push(c.name)
                                        contentvalue.push(c.description)
                                        contentalias.push(c.aliases)
                                        contentexample.push(c.examples);
                                    }
                                } else {
                                    /*contentname.push(c.name)
                                    contentvalue.push(c.description)
                                    contentalias.push(c.aliases)
                                    contentexample.push(c.examples);*/
                                }
                            })
                            helpembed(language(guild, 'HELP_TITLE'), `${categories[page - 1]}`, page, contentname, contentvalue, contentalias)
                        }
                    })
                }
                await reaction.users.remove(user.id);
                return
            } else {
                return;
            }
        });
    }
}