const fs = require('fs');
const Discord = require('discord.js');
const { MessageAttachment } = require('discord.js')
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const icons = require('../icon/icon')
const rulesSchema = require('../../schemas/rules-schema')
const boticons = require('../reaction/boticons'); // boticons(client, 'emojiname)
const { MessageMenuOption, MessageMenu } = require('discord-buttons');
const commandStats = require('../../Stats/commandStats');
module.exports = class InformationCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'information',
            aliases: ['serverwelcome', 'serverinformation', 'welcome'],
            group: 'features',
            memberName: 'information',
            description: 'set server rules',
            userPermissions: ['ADMINISTRATOR'],
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
            examples: ['info']
        })
    }

    async run(message, args) {
        message.delete()
        this.examples = this.memberName
        const { guild, channel } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'information')
        let result = await rulesSchema.findOneAndUpdate({
            guildId: guild.id
        }, {
            guildId: guild.id,
        }, {
            upsert: true,
        })
        let ruletxt = ''
        const options = []
        let i = 0;

        for (const guildrules of result.rules) {
            const { rule, rulecreator} = guildrules
            
            let txt = `${icons(guild, 'chevronright')} ${rule}\n`
            ruletxt += txt
            let ruleoption = new MessageMenuOption()
                .setLabel(rule)
                .setValue(i + 1)
                .setEmoji(icons(guild, 'chevronright').id)
            options.push(ruleoption)
            i++;
        }
        
        let verify = new MessageMenuOption()
            .setLabel('Verify')
            .setDescription('Click to verify')
            .setValue(0)
            .setEmoji('858104735978356807')
        options.push(verify)
        const VerifyMenu = new MessageMenu()
            .setID('Rules')
            .setPlaceholder('Rules & Verify')
            .addOptions(options)
            .setMaxValues(1)
            .setMinValues(1)

            
        if (!result || !result.channelId) {
            tempMsg(message.channel, `${language(guild, 'INFO_NOCHANNEL')}`, 10)
            return
        }
        

        const g = this.client.guilds.cache.get(result.guildId);
        const { 
            name, 
            region, 
            memberCount, 
            owner, 
            afkTimeout, 
            nameAcronym, 
            description, 
            defaultMessageNotifications, 
            embedEnabled, 
            features,
            createdAt
        } = g
        function getPosition(string, subString, index) {
            return string.split(subString, index).join(subString).length;
        }
        const d = new Date()
        const dateformat = (d) => {
            let dformat = [
                d.getDate(),
                d.getMonth()+1,
                d.getFullYear()
            ].join('/');
            return dformat
        }

        

        let guildageyear = (d.getFullYear() - createdAt.getFullYear());
        let guildagemonth = (d.getMonth()+1) - (createdAt.getMonth()+1);

        let t = result.text
        let infotitle = t.substring(getPosition(t, '-', 0), getPosition(t, '-', 1)).replace('-', '').trim();
        let infodescription = t.substring(getPosition(t, '-', 1), getPosition(t, '-', 2)).replace('-', '').trim();
        let info = [
            `Region: ${region}`,
            `${language(guild, 'INFO_SETBIRTHDAY')} -addbirthday date/month`,
            `${language(guild, 'INFO_NOTIFICATION')}: ${defaultMessageNotifications.toLocaleLowerCase()}`,
            `${language(guild, 'INFO_HASMEMBERS')} **${memberCount}** ${language(guild, 'SERVERINFO_MEMBERS')}`,
            `${language(guild, 'INFO_CREATED')} ${dateformat(createdAt)}`,
            `${language(guild, 'INFO_AGE')}: ${guildageyear < 1 ? `${guildagemonth} ${language(guild, 'MONTHS')}` : `${guildageyear} ${language(guild, 'YEARS')}`}`
        ].join('\n')
        
        let attachment = ''
        // Check if guild has slashimage
        if (!g.splashURL()) {
            attachment = new MessageAttachment(g.bannerURL())
            if (!g.bannerURL()) {
                attachment = new MessageAttachment(g.discoverySplashURL())
                if (!g.discoverySplashURL()) {
                    attachment = new MessageAttachment(g.iconURL())
                }
            }
        } else {
            attachment = new MessageAttachment(g.splashURL())
        }
        
        const line = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'
        const channelinfo = this.client.channels.cache.get(result.channelId)
        /*let embed = new Discord.MessageEmbed()
            .setTitle(`${boticons(this.client, 'info')} ${result.text}`)
            .setColor(config.botEmbedHex)
            .setDescription(ruletxt)
            .setThumbnail(g.splashURL())
        await channelinfo.send(embed)*/
        channelinfo.send('** **', attachment)
        let msgtxt = `**${infotitle}**\n\n${infodescription}\n\n**${language(guild, 'INFO_RULETXT')}**:\n${ruletxt}\n${line}\n**${language(guild, 'INFO_SERVERINFO')}**:\n${info}`
        
        if (result.verifyrole != "") {
            msgtxt += `\n\n${language(guild, 'INFO_VERIFY')}`;
            setTimeout(() => {
                channelinfo.send(`${msgtxt}`, VerifyMenu);
            }, 500);
            
            const verifiedrole = message.guild.roles.cache.find(r => r.id === result.verifyrole)
            this.client.on('clickMenu', async (m) => {
                m.reply.defer()
                if (m.values[0] == 0) {
                    m.clicker.member.roles.add(verifiedrole)
                } else {
                    return;
                }
            })
        } else {
            setTimeout(() => {
                channelinfo.send(`${msgtxt}`);
            }, 500);
        }
    }
}
