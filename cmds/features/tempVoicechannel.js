const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const commandStats = require('../../Stats/commandStats')
module.exports = class TempVCCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'voicechannel',
            aliases: ['vc'],
            group: 'features',
            memberName: 'voicechannel',
            description: 'create a temporary voicechannel',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL',
                'MANAGE_CHANNELS'
            ],
            //examples: ['"voice channel name"', 'max number of people in voicechannel']
        })
    }

    async run(message, args) {
        message.delete()
        const { guild, channel, content, member } = message;
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'voicechannel')
        const msg = content;
        let VCname = '';
        if (args[0] != null) {
            VCname = args.join(' ')
            message.guild.channels
                .create(VCname, {
                    type: 'voice',
                })
            /*if (message.member.voice.channel) {
                const vcchannel = message.guild.channels.cache.find((c) => c.name === VCname);
                member.voice.setChannel(vcchannel);
            }*/
            return
            //return tempMsg(channel, `${language(guild, 'VC_NONAME')}`, 10);
        }
        
        const confirmation = await message.channel.send(`Enter channelname`)//tempMsg(message.channel, `${language(guild, 'VC_NONAME')}`, 60);
        const filter = (m) => m.author.id === message.author.id

        const collector = confirmation.channel.createMessageCollector(filter, {
            max: 1,
            time: 60000,
        });
    
        collector.on('collect', async (m) => {
            console.log(m.content)
            VCname = m.content;
            m.guild.channels
                .create(VCname, {
                    type: 'voice',
                })
        });
        
    
        collector.on('end', (collected, reason) => {
            console.log(reason)
            if (reason === 'time') {
                tempMsg(message.channel, 'Time ran out', 5);
            }
        });
    }
}