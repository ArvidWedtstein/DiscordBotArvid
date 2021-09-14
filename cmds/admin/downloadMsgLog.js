const fs = require(`fs`);
const tempmsg = require('../misc/temporary-message')
var d = new Date();
const Discord = require('discord.js');
const settings = require('../features/setting')
const language = require('../language/language')
const { MessageMenuOption, MessageMenu } = require('discord-buttons');
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class MessageLogCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'messagelog',
            aliases: ['msglog'],
            group: 'admin',
            memberName: 'messagelog',
            description: 'get messagelog',
            userPermissions: ['KICK_MEMBERS'],
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
            guildOnly: true
        })
    }

    async run(message, args) {
        const { guild } = message
        const guildId = guild.id 
        commandStats.cmdUse(guildId, 'messagelog')
        const setting = await settings.setting(message, 'moderation');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            message.delete()
            const joined = args.join(" ");
            const split = joined.trim('-msglog ');
            const dat = `${d.getDate()} ${d.getMonth()+1} ${d.getFullYear()}` 
            try {
                // try to read file
                await fs.promises.readFile(`./logs/messageLog/messageLog - ${dat}.txt`)
                
                //console.log(split)
                
                message.reply(`${language(guild, 'MGSLOG_DOWNLOAD')} ${split}`, {
                    files: [`./logs/MessageLog/messageLog - ${split}.txt`]
                });
            } catch (error) {
                // file not found
                tempmsg(message.channel, `${language(guild, 'MSGLOG_NOLOGFOUND')} ${split}`, 5)
                return
            }
        }
    }
}

