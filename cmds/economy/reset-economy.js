const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const profileSchema = require('../../schemas/profileschema')
const commandStats = require('../../Stats/commandStats')
module.exports = class ResetEconomyCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'reseteconomy',
            aliases: ['resetmoney'],
            group: 'economy',
            memberName: 'reseteconomy',
            description: 'reset economy, will delete all economy data',
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
        })
    }

    async run(message, args) {
        message.delete();
        const { guild, content } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'reseteconomy')
        const confirmation = await message.channel.send(`${language(guild, 'ECONOMY_RESET')} (Y, N, yes, no)`)
        const filter = (m) => m.author.id === message.author.id

        const collector = confirmation.channel.createMessageCollector(filter, {
            max: 1,
            time: 60000,
        });
    
        collector.on('collect', async (m) => {
            if (m.content.toLowerCase() == 'y' || 'yes') { 
                const result = await profileSchema.deleteMany({
                    guildId
                })
                tempMsg(m.channel, `${language(guild, 'ECONOMY_RESETSUCCESS')}`, 10)
            } else if (m.content.toLowerCase() == 'n' || 'no') {
                tempMsg(m.channel, `${language(guild, 'RESET_CANCELLED')}`, 5)
            }
        });
        
    
        collector.on('end', (collected, reason) => {
            console.log(reason)
            if (reason === 'time') {
                tempMsg(message.channel, `${language(guild, 'RESET_CANCELLED')}`, 5);
            }
        });
    }
}