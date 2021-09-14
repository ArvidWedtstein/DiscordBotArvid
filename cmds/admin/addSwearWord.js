const swearFilterSchema = require('../../schemas/swearfilter-schema')
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const commandStats = require('../../Stats/commandStats')
const settings = require('../features/setting')
const Commando = require('discord.js-commando')
module.exports = class AddSwearWordCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'addswearword',
            aliases: ['+swear'],
            group: 'admin',
            memberName: 'addswearword',
            description: 'add a swearword',
            userPermissions: [
                'SEND_MESSAGES',
                'VIEW_CHANNEL',
                'MENTION_EVERYONE',
                'MANAGE_MESSAGES'
            ],
            argsType: 'multiple',
        })
    }

    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'addswearword')
        const setting = await settings.setting(message, 'swearfilter');
        if (setting == false) {
            message.reply(`${language(guild, 'SETTING_OFF')} Swearfilter ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const guildId = message.guild.id
            /*const words = {
                AddedBy: message.author.tag,
                word: args[0]
            }*/
            const words = args[0]
            const result = await swearFilterSchema.findOneAndUpdate({
                guildId,
            }, {
                guildId,
                $push: {
                    swearwords: words
                }
            }, {
                upsert: true
            })
            console.log(`Successfully added word ${args[0]}`)
        }
        
    }
}