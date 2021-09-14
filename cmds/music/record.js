const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class RecordCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'record',
            aliases: ['rec'],
            group: 'music',
            memberName: 'record',
            description: 'record a voice channel',
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL',
                'SPEAK',
                'CONNECT'
            ],
            hidden: true,
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        
        const voicechannel = message.member.voice.channel;
        if (!voicechannel) {
            return message.reply(`Please join a voice channel first`)
        }
        if (args[0] == 'stop') {
            message.member.voice.channel.leave();
            message.reply(`Finished recording`);
        }
        const channel = message.member.voice.channel

        // Move member to channel
        //message.guild.member(message.author.id).voice.setChannel("712965198733901834");
        
        const connection = await message.member.voice.channel.join();
        const receiver = connection.receiver.createStream(message.member, {
            mode: "pcm",
        });
        const writer = receiver.pipe(fs.createWriteStream(`./recorded.pcm`));
        this.client.on('voiceStateUpdate', async (oldState, newState) => {
            if (oldState.channel !== null && newState.channel === null) {
                
                channel.leave();
                /*writer.on("finish", () => {
                    
                    //message.reply(`Finished recording`);
                });*/
            }
          });
        

        
        
    }
}

