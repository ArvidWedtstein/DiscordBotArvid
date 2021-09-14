const profileSchema = require('../../schemas/profileschema')
const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
const level = require('../../levels');
const temporaryMessage = require('../misc/temporary-message');
module.exports = class SetUserColorCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'color',
            aliases: ['usercolor'],
            group: 'features',
            memberName: 'usercolor',
            description: 'set your custom color',
            argsType: 'multiple',
            userPermissions: ['SEND_MESSAGES'],
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
        message.delete()
        const colors = {
            red: '#ff0000',
            blue: '#0000ff',
            green: '#00ff00',
            magenta: '#ff00ff',
            yellow: '#ffff00',
            cyan: '#00ffff',
            purple: '#6400ff',
            orange: ''
        }
        const { guild, author: user } = message
        const guildId = guild.id;
        const userId = user.id;

        
        let userlevel = await level.getLevel(guildId, userId);
        if (userlevel < '110') {
            temporaryMessage(message.channel, `${language(guild, 'COLOR_LVL')}`, 30);
            return;
        }
        commandStats.cmdUse(guildId, 'color')
        const profileresult = await profileSchema.findOne({ guildId, userId })
        
        const color = args[0];

        var re = /[0-9A-Fa-f]{6}/g;
        
        
        
        if(re.test(color)) {
            if (!profileresult) {
                temporaryMessage(message.channel, `${language(guild, 'COLOR_ADD')} (${color})`, 30)
                new profileSchema({
                    guildId,
                    userId,
                    $set: {
                        color
                    }
                })
            } else {
                temporaryMessage(message.channel, `${language(guild, 'COLOR_USER')} **${color}**`, 30)
    
                const result = await profileSchema.findOneAndUpdate({
                    guildId,
                    userId
                }, {
                    guildId,
                    userId,
                    $set: {
                        color
                    }
                }, {
                    upsert: true,
                })
            }
        } else {
            temporaryMessage(message.channel, `${language(guild, 'COLOR_INVALID')}`, 30)
        }
        
    }
}
