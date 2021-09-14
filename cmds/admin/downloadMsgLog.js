const tempmsg = require('../misc/temporary-message')
var d = new Date();
const Discord = require('discord.js');
const settings = require('../features/setting')
const language = require('../language/language')
const { MessageMenuOption, MessageMenu } = require('discord-buttons');
const Commando = require('discord.js-commando')
const config = require('../../config.json');
const path = require('path');
const settingsSchema = require('../../schemas/settings-schema');
const fs = require('fs');
const fsPromises = fs.promises;
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

            const filesArray = [];
            const dirs = await fsPromises.readdir("./logs/MessageLog", {
                withFileTypes: true 
            });
        
            //loop through all files/directories
            for (let i = 0; i < dirs.length; i++) {
                const currentDir = dirs[i];
                const newPath = path.join("./logs/MessageLog", currentDir.name);
                filesArray.push(newPath);
            }
            
            

            let result = await settingsSchema.findOne({
                guildId
            })
            if (result.serverlog) {
                const logchannel = guild.channels.cache.find(channel => channel.id === result.serverlog);
                if (logchannel.deleted) return;
                let logembed = new Discord.MessageEmbed()
                    .setColor(config.botEmbedHex)
                    .setAuthor(`${message.author.username} downloaded "${split}" messagelog`, message.author.displayAvatarURL())
                logchannel.send({embed: logembed});
            }


            const options = []
            for (let i = 0; i < filesArray.length; i++) {
                let role = new MessageMenuOption()
                    .setLabel(filesArray[i])
                    .setValue(i + 1)
                    .setDescription(`${filesArray[i]} log`)
                options.push(role)
            }
            if (options.length > 25) {
                for (let i = 0; options.length > 25; i++) {
                    options.pop();
                }
            }
            const Menu = new MessageMenu()
                .setID('Menu')
                .setPlaceholder('Select Messagelog')
                .addOptions(options)
                .setMaxValues(1)
                .setMinValues(1)
            message.channel.send(`r`, Menu)

            /*try {
                // try to read file
                await fs.promises.readFile(`./logs/messageLog/messageLog - ${dat}.txt`)
                
                
                /*message.reply(`${language(guild, 'MGSLOG_DOWNLOAD')} ${split}`, {
                    files: [`./logs/MessageLog/messageLog - ${split}.txt`]
                });*/
            /*} catch (error) {
                // file not found
                tempmsg(message.channel, `${language(guild, 'MSGLOG_NOLOGFOUND')} ${split}`, 5)
                return
            }*/

        }
    }
}

