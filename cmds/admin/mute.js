const muteSchema = require('../../schemas/mute-schema')
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const settings = require('../features/setting');
const commandStats = require('../../Stats/commandStats')
const { MessageMenuOption, MessageMenu } = require('discord-buttons');
const boticons = require('../reaction/boticons');
const reasons = {
    SPAMMING: 1,
    ADVERISING: 6,
    ABUSING: 24,
    BULLYING: 12,
    NOTACCEPTINGGERMANTERRITORY: 10,
    ANNOYING: 2
}

module.exports = class MuteCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            aliases: ['silence'],
            group: 'admin',
            memberName: 'mute',
            description: 'mutes a user',
            guildOnly: true,
            userPermissions: ['MUTE_MEMBERS'],
            clientPermissions: ['ADMINISTRATOR'],
            argsType: 'multiple',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ]
        })
    }

    async run(message, args) {
        message.delete()
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const { guild, author: staff } = message
            /*if (args.length !== 2) {
                message.reply(`Correct syntax: ${guild.commandPrefix}mute <Target @> <Reason>`)
                return
            }*/
            const guildId = guild.id
            commandStats.cmdUse(guildId, 'mute')
            const target = message.mentions.users.first()
            if (!target) {
                message.reply(`${language(guild, 'VALID_USER')}`)
                return
            }
            let options1 = new MessageMenuOption()
                .setLabel('spamming')
                .setValue("1")
                .setDescription(reasons['SPAMMING'])
                .setDefault()
                .setEmoji('♻️')
            let options2 = new MessageMenuOption()
                .setLabel('advertising')
                .setValue("2")
                .setDescription(reasons['ADVERISING'])
                .setDefault()
                .setEmoji('♻️')
            let options3 = new MessageMenuOption()
                .setLabel('abusing')
                .setValue("3")
                .setDescription(reasons['ABUSING'])
                .setDefault()
                .setEmoji('♻️')
            let options4 = new MessageMenuOption()
                .setLabel('bullying')
                .setValue("4")
                .setDescription(reasons['BULLYING'])
                .setDefault()
                .setEmoji('♻️')
            let options5 = new MessageMenuOption()
                .setLabel('germanterritory')
                .setValue("5")
                .setDescription(reasons['NOTACCEPTINGGERMANTERRITORY'])
                .setDefault()
                .setEmoji('♻️')
            let options6 = new MessageMenuOption()
                .setLabel('annoying')
                .setValue("6")
                .setDescription(reasons['ANNOYING'])
                .setDefault()
                .setEmoji('♻️')
            let select = new MessageMenu()
                .setID('Selection')
                .setMaxValues('1')
                .setMinValues('1')
                .setPlaceholder('Select Mute reason')  
                .addOptions([options1, options2, options3, options4, options5, options6])
                
            let reason = ''
            if (!args[1]) {
                /*let validReasons = ''
                for (const key in reasons) {
                    validReasons += `${key}, `
                }   
        
                validReasons = validReasons.substr(0, validReasons.length - 2)*/
                message.channel.send('** **', select)
                
                //message.reply(`${language(guild, 'MUTE_UNKNOWNREASON')} ${validReasons}`, select)
                //return
            } else {
                reason = args[1].toUpperCase()
                if (!reasons[reason]) {
                    let validReasons = ''
                    for (const key in reasons) {
                        validReasons += `${key}, `
                    }   
            
                    validReasons = validReasons.substr(0, validReasons.length - 2)
                    message.reply(`${language(guild, 'MUTE_UNKNOWNREASON')} ${validReasons}`)
                    return
                }
            }
            function menuselection(menu) {
                switch (menu.values[0]) {
                    case "1":
                        reason = 'SPAMMING'
                        break;
                    case "2":
                        reason = 'ADVERISING'
                        break;
                    case "3":
                        reason = 'ABUSING'
                        break;
                    case "4":
                        reason = 'BULLYING'
                        break;
                    case "5":
                        reason = 'NOTACCEPTINGGERMANTERRITORY'
                        break;
                    case "6": 
                        reason = 'ANNOYING'
                        break;  
                }
            }
            this.client.on('clickMenu', async (menu) => {
                menu.reply.defer();
                if (menu.clicker.user.id == message.author.id) {
                    if (menu.message.id != message.id) return;
                    menuselection(menu)

                    const previousMutes = await muteSchema.find({
                        userId: target.id
                    })
            
                    const currentlyMuted = previousMutes.filter(mute => {
                        return mute.current === true
                    })
            
            
            
                    if (currentlyMuted.length) {
                        message.reply(`${language(guild, 'MUTE_USERMUTED')}`)
                        return
                    }
                    let duration = reasons[reason] * (previousMutes.length + 1)
                    const expires = new Date()
                    expires.setHours(expires.getHours() + duration)
                    
                    //expires.setMinutes(expires.getMinutes() + duration)
                    let mutedRole = guild.roles.cache.find(role => {
                        return role.name === 'Muted'
                    })
                    if (!mutedRole) {
                        //message.guild.roles.create( {name: 'Muted', color: "#818386" } )
                        message.guild.roles.create({ data: { name: 'Muted', color: '#818386', permissions: [] } });
                        
                        
                        setTimeout(async () => {
                            mutedRole = await message.guild.roles.cache.find(roleval => roleval.name === "Muted");
                            if (!mute2) {
                                return
                            }
                        
                            const highestrole = message.guild.me.roles.highest;
                            await mutedRole.setPosition(highestrole.position - 1);
                        }, 500)
                    }
            
                    const targetMember = (await guild.members.fetch()).get(target.id)
                    targetMember.roles.add(mutedRole)
            
                    await new muteSchema({
                        userId: target.id,
                        guildId: guild.id,
                        reason,
                        staffId: staff.id,
                        staffTag: staff.tag,
                        expires: expires,
                        current: true
                    }).save()
            
                    const timeemoji = this.client.emojis.cache.get('862388254988959825');
                    let embed = new Discord.MessageEmbed()
                    .setColor('ff0000')
                    .setAuthor(`${target.username} ${language(guild, 'MUTE_TITLE')}!`, `${target.displayAvatarURL()}`)
                    .addField(`${language(guild, 'MUTE_DURATION')}`, `${duration} minute${duration === 1 ? '' : 's'}${timeemoji}`)
                    .addField(`${language(guild, 'BAN_REASON')}: `, `${reason}${boticons(this.client, 'thisisfine')}`)
                    .setTimestamp()
                    .setFooter(`Mute ${language(guild, 'MUTE_BY')} ${message.author.username}.`, `${message.author.displayAvatarURL()}`)
                    let messageEmbed = message.channel.send(embed);
                }
            })
            
            /*const previousMutes = await muteSchema.find({
                userId: target.id
            })
    
            const currentlyMuted = previousMutes.filter(mute => {
                return mute.current === true
            })
    
    
    
            if (currentlyMuted.length) {
                message.reply(`${language(guild, 'MUTE_USERMUTED')}`)
                return
            }
    
            let duration = reasons[reason] * (previousMutes.length + 1)
    
            const expires = new Date()
            //expires.setHours(expires.getHours() + duration)
            expires.setMinutes(expires.getMinutes() + duration)
            let mutedRole = guild.roles.cache.find(role => {
                return role.name === 'Muted'
            })
            if (!mutedRole) {
                //message.guild.roles.create( {name: 'Muted', color: "#818386" } )
                message.guild.roles.create({ data: { name: 'Muted', color: '#818386', permissions: [] } });
                
                
                setTimeout(async () => {
                    mutedRole = await message.guild.roles.cache.find(roleval => roleval.name === "Muted");
                    if (!mute2) {
                        return
                    }
                
                    const highestrole = message.guild.me.roles.highest;
                    await mutedRole.setPosition(highestrole.position - 1);
                }, 500)
            }
    
            const targetMember = (await guild.members.fetch()).get(target.id)
            targetMember.roles.add(mutedRole)
    
            await new muteSchema({
                userId: target.id,
                guildId: guild.id,
                reason,
                staffId: staff.id,
                staffTag: staff.tag,
                expires,
                current: true
            }).save()
    
            const timeemoji = this.client.emojis.cache.get('862388254988959825');
            let embed = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setAuthor(`${target.username} ${language(guild, 'MUTE_TITLE')}!`, `${target.displayAvatarURL()}`)
            .addField(`${language(guild, 'MUTE_DURATION')}`, `${duration} minute${duration === 1 ? '' : 's'}${timeemoji}`)
            .addField(`${language(guild, 'BAN_REASON')}: `, `${reason}`)
            .setTimestamp()
            .setFooter(`Mute ${language(guild, 'MUTE_BY')} ${message.author.username}.`, `${message.author.displayAvatarURL()}`)
            let messageEmbed = message.channel.send(embed);*/
        }
        
    }
}