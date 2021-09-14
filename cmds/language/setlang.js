const { languages } = require('../language/lang.json')
const language = require('../language/lang.json')
const languageSchema = require('../../schemas/language-schema')
const tempMsg = require('../misc/temporary-message');
const mongo = require('../../mongo')
const config = require('../../config.json')
const { MessageMenuOption, MessageMenu, MessageActionRow, MessageButton } = require('discord-buttons');
const Discord = require('discord.js');
const { setLanguage }  = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class SetLanguageCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'setlanguage',
            aliases: ['setlang'],
            group: 'language',
            memberName: 'setlanguage',
            description: 'set server language',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR']
        })
    }

    async run(message, args) {
        message.delete()
        const language = ['🇩🇪', '🇳🇴', '🇬🇧', '❌']
        const getEmoji = emojiName => client.emojis.cache.find((emoji) => emoji.name === emojiName)
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'setlanguage')
        const en = new MessageButton()
            .setEmoji('🇬🇧')
            .setStyle(3)
            .setID('3')
        const de = new MessageButton()
            .setEmoji('🇩🇪')
            .setStyle(3)
            .setID('1')
        const no = new MessageButton()
            .setEmoji('🇳🇴')
            .setStyle(3)
            .setID('2')
        const close = new MessageButton()
            .setEmoji('❌')
            .setStyle(3)
            .setID('4')
        let embed = new Discord.MessageEmbed()
        .setColor(config.botEmbedHex)
        .setTitle(`Language`)
        .setDescription(`Select Language\nNot all translations may be correct`)
        /*.addFields(
            {name: language[0], value: 'German'},
            {name: language[1], value: `Norwegian`},
            {name: language[2], value: `English`},
        )*/
        let messageEmbed = await message.channel.send({
            embed: embed,
            buttons: [de, no, en]
        });
        
        /*messageEmbed.react(language[0]);
        messageEmbed.react(language[1]);
        messageEmbed.react(language[2]);*/

        this.client.on('clickButton', async (btn) => {

            switch (btn.id) {
                case "1":
                    let embedDE = new Discord.MessageEmbed()
                    .setTitle(`Language`)
                    .setDescription(`Language set to German${language[0]}`)
                    .addFields(
                        {name: language[3], value: 'back'}
                    )
                    let messageEmbedDE = await messageEmbed.edit({
                        embed: embedDE,
                        buttons: [close]
                    });
                    //await messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    //await messageEmbed.react(language[3]);
                    setLanguage(guild, 'german')
                    await languageSchema.findOneAndUpdate({
                        guildId: guild.id
                    }, {
                        guildId: guild.id,
                        language: 'german'
                    }, {
                        upsert: true
                    })
                    break;
                case "2":
                    let embedNO = new Discord.MessageEmbed()
                    .setTitle(`Language`)
                    .setDescription(`Language set to Norwegian${language[1]}`)
                    .addFields(
                        {name: language[3], value: 'back'}
                    )

                    //await messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    
                    let messageEmbed1 = await messageEmbed.edit({
                        embed: embedNO,
                        buttons: [close]
                    });
                    //await messageEmbed.react(language[3]);
                    setLanguage(guild, 'norwegian')

                    await languageSchema.findOneAndUpdate({
                        guildId: guild.id
                    }, {
                        guildId: guild.id,
                        language: 'norwegian'
                    }, {
                        upsert: true
                    })
                    break;
                case "3":
                    let embedeng = new Discord.MessageEmbed()
                    .setTitle(`Language`)
                    .setDescription(`Language set to English${language[2]}`)
                    .addFields(
                        {name: language[3], value: 'Close'}
                    )
                    //await messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    
                    let messageEmbed2 = await messageEmbed.edit({
                        embed: embedeng,
                        buttons: [close]
                    });
                    //messageEmbed2.react(language[3]);

                    setLanguage(guild, 'english')

                    await languageSchema.findOneAndUpdate({
                        guildId: guild.id
                    }, {
                        guildId: guild.id,
                        language: 'english'
                    }, {
                        upsert: true
                    })
                    break;
                case "4": 
                    /*let embeddef = new Discord.MessageEmbed()
                    .setTitle(`Language`)
                    .setDescription(`Select Language`)
                    .addFields(
                        {name: language[0], value: 'German'},
                        {name: language[1], value: `Norwegian`},
                        {name: language[2], value: `English`},
                    )
                    await messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    let messageEmbed5 = await messageEmbed.edit(embeddef);
                    
                    await messageEmbed.react(language[0]);
                    await messageEmbed.react(language[1]);
                    await messageEmbed.react(language[2]);*/

                    await messageEmbed.delete();
                            
            }
                
        });

        /*const targetLanguage = args[0].toLowerCase()
        if (!languages.includes(targetLanguage)) {
            tempMsg(message.channel, 'That language is not supported.', 10)
            return
        }*/
    }
}