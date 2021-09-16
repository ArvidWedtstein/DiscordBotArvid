const warnSchema = require('../../schemas/warn-schema')
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const tempmsg = require('../misc/temporary-message')
const settings = require('../features/setting')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const { MessageMenuOption, MessageMenu } = require('discord-buttons');
const config = require('../../config.json')
module.exports = class ListWarnsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'listwarns',
            aliases: ['warns'],
            group: 'admin',
            memberName: 'listwarns',
            description: 'shows your warns',
            userPermissions: ['MANAGE_EMOJIS'],
            guildOnly: true,
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        //message.delete()
        const { guild } = message
        const setting = await settings.setting(message, 'moderation');
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'listwarns')
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const target = message.mentions.users.first()

            if (!target) {
                message.reply(`${language(guild, 'VALID_USER')}`)
                return
            }
            const guildId = guild.id
            const userId = target.id
    
    
            const results = await warnSchema.findOne({
                guildId,
                userId
            })
            
            const menuoptions = []
            
    
            let warntxt = `${language(guild, 'WARN_PREVIOUS')} ${target.username}\n\n`
            if (!results) {
                warntxt += 'no warns'
            } else {
                let i = 0;
                for (const warning of results.warnings) {
                    const { author, timestamp, reason } = warning
                   
                    i++

                    let warn = new MessageMenuOption()
                        .setLabel(`${language(guild, 'BAN_REASON')}: ${reason}`)
                        .setValue(i)
                        .setDescription(`${language(guild, 'MUTE_BY')} ${author} | ${new Date(timestamp).toLocaleDateString()}`)
                    menuoptions.push(warn)
                }
                const Menu = new MessageMenu()
                    .setID('Menu')
                    .setPlaceholder('Select Remove warns')
                    .addOptions(menuoptions)
                    .setMaxValues(0)
                    .setMinValues(0)


                let embed = new Discord.MessageEmbed()
                .setColor(config.botEmbedHex)
                .setTitle('Warns')
                .setDescription(warntxt)

                message.reply(embed, Menu).catch(console.error);
            }
        }
    }
}