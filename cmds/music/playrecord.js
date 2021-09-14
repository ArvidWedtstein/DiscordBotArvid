const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
module.exports = class PlayRecordCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'playrecord',
            aliases: ['prec'],
            group: 'music',
            memberName: 'playrecord',
            description: 'play a recording',
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['ADMINISTRATOR'],
            hidden: true
        })
    }

    async run(message, args) {
        const voicechannel = message.member.voice.channel;
        if (!voicechannel) {
            return message.reply(`Please join a voice channel first`)
        }
        if (!fs.existsSync(`./recorded.pcm`)) {
            return message.reply(`Your audio is not recorded.`)
        }
        const connection = await message.member.voice.channel.join();
        const stream = fs.createReadStream(`./recorded.pcm`);

        const dispatcher = connection.play(stream, {
            type: "converted"
        })

        dispatcher.on("finish", () => {
            message.member.voice.channel.leave()
        })
    }
}

