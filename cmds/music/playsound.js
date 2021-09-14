const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
module.exports = class PlaySoundCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'playsound',
            aliases: ['ps'],
            group: 'music',
            memberName: 'playsound',
            description: 'play a sound',
            userPermissions: ['ADD_REACTIONS'],
            argsType: 'multiple'
        })
    }

    async run(message, args) {
        


        async function crawl(directory, filesArray) {
            const dirs = await fsPromises.readdir(directory, {
                withFileTypes: true 
            });
        
            //loop through all files/directories
            for (let i = 0; i < dirs.length; i++) {
                const currentDir = dirs[i];
                const newPath = path.join(currentDir.name.replace('.mp3', ''));
                 if (currentDir.isDirectory()) {
                     //if directory crawl again.
                     await crawl(newPath, filesArray);
                 }
                 else {
                     //if it is a file append it to the array
                     filesArray.push(newPath);
                 }
            }
        }

        let audioFiles = []; // create empty array and pass it into the crawl function
        await crawl('./audio', audioFiles);
        if (!args[0]) {
            return message.reply(`Invalid audio file. choose one of these: \n${audioFiles.join(",\n")}`)
        }
        
        if (!audioFiles.includes(args[0])) {
            return message.reply(`Invalid audio file. choose one of these: \n${audioFiles.join(",\n")}`)
        }
        let soundtxt = args[0] + '.mp3'

        var voiceChannel = message.member.voice.channel;
        let sound = './audio/' + soundtxt
        voiceChannel.join().then(connection =>{
            const dispatcher = connection.play(`${sound}`);
            /*dispatcher.on('start', () => {
                connection.player.streamingData.pausedTime = 0;
            });*/
            dispatcher.on("end", end => {
                voiceChannel.leave();
            });
        }).catch(err => console.log(err));
    }
}