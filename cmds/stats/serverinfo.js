const Discord = require('discord.js');
const settingsSchema = require('../../schemas/settings-schema');
const messageCountSchema = require('../../schemas/message-count-schema')
const config = require('../../config.json')
const language = require('../language/language')
const Commando = require('discord.js-commando')

module.exports = class ServerInfoCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            aliases: ['guildinfo'],
            group: 'stats',
            memberName: 'serverinfo',
            description: 'gives information about the server',
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
        message.delete();
        const { guild } = message
        const { name, region, memberCount, owner, afkTimeout } = guild
        const icon = guild.iconURL()
        const splash = guild.splashURL()
        const banner = guild.bannerURL();
        const news = guild.news
        const discoverySplash = guild.discoverySplashURL()
        //const guildfeatures = guild.features
        const guildId = guild.id;
        
        const msgresult = await messageCountSchema.find({
            guildId: guildId
        })
        var msgnmb = 0;
        for (let index = 0; index < msgresult.length; index++) {
            const { messageCount = 0 } = msgresult[index]
            msgnmb = msgnmb + messageCount
        }

        // Get server boosters
        let nitroboosters;
        const nitroRole = guild.roles.cache.find(r => r.name === 'Server Booster')
        if (!nitroRole) {
            nitroboosters = 0;
        } else {
            nitroboosters = guild.roles.cache.get(nitroRole.id).members.size;
        }
        
        const embed = new Discord.MessageEmbed()
            .setTitle(`${language(guild, 'SERVERINFO_TITLE')} "${name}"`)
            .setThumbnail(icon)
            .setImage(splash)
            .setColor(config.botEmbedHex)
            //.setImage(banner)
            .addFields(
                {
                    name: 'Territory',
                    value: region
                },
                {
                    name: `${language(guild, 'SERVERINFO_MEMBERS')}`,
                    value: memberCount
                },
                {
                    name: `${language(guild, 'SERVERINFO_OWNER')}`,
                    value: owner.user.tag
                },
                {
                    name: 'AFK Timeout',
                    value: afkTimeout / 60 + 'min'
                },
                /*{
                    name: `Emote ${language(guild, 'SERVERINFO_SETTINGS')}`,
                    value: settingsEmotes
                },
                {
                    name: `Money System ${language(guild, 'SERVERINFO_SETTINGS')}`,
                    value: settingsMoney
                },
                {
                    name: `Ticket System ${language(guild, 'SERVERINFO_SETTINGS')}`,
                    value: settingsTicket,
                },*/
                {
                    name: `${language(guild, 'SERVERINFO_MESSAGESSENT')}`,
                    value: msgnmb
                },
                {
                    name: `Server Booster${nitroboosters === 1 ? '' : 's'}:`,
                    value: `${nitroboosters}`
                },
            )
        message.channel.send(embed);
    }
}