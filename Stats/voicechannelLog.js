const Discord = require('discord.js');
const fs = require('fs');
const settingsSchema = require('../schemas/settings-schema')
module.exports = async (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        let newUserChannel = newState.voiceChannel
        let oldUserChannel = oldState.voiceChannel
        const guild = 'test'
        
        if (oldState.channel === null && newState.channel !== null) {
            // User Joins a voice channel
            
            var d = new Date();
            const dformat = [
                d.getDate(),
                d.getMonth()+1,
                d.getFullYear()
            ].join('/')
            
            let content = `joined ${oldState.member.voice.channel}`
            if (oldState.member.bot) {
                return
            }
            const dat = `${d.getDate()} ${d.getMonth()+1} ${d.getFullYear()}` 
            try {
                // try to read file
                await fs.promises.readFile(`./logs/VoiceLog/voicelog - ${dat}.txt`)
                const text = fs.readFileSync(`./logs/VoiceLog/voicelog - ${dat}.txt`).toString();
    
                fs.writeFile(`./logs/VoiceLog/voicelog - ${dat}.txt`, `${d.toLocaleTimeString()}` + ' : ' + `${guild} | ${oldState.member.user.username}` + ': ' + `${content}` + '\n' + `${text}`, err => {
                    if (err) throw err;
                });
              } catch (error) {
                // create empty file, because it wasn't found
                await fs.promises.writeFile(`./logs/VoiceLog/voicelog - ${dat}.txt`, `${d.toLocaleTimeString()}` + ' : ' + `${guild} | ${user}` + ': ' + `${content}` + '\n', err => {
                    if (err) throw err;
                });
            }
        }
    })
}
