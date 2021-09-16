const Discord = require('discord.js');
const fs = require('fs');
const settings = require('../features/setting')
module.exports = async (client) => {
    client.on('message', async (message) => {
        const { content, guild } = message
        if (!guild) {
            return
        }
        const setting = await settings.setting(message, 'moderation');
        
        if (setting == false) {
            return
        } else if (setting == true) {
            var d = new Date();
            const dformat = [
                d.getDate(),
                d.getMonth()+1,
                d.getFullYear()
            ].join('/')
            if (message.author.bot) {
                return;
            }
            const dat = `${d.getDate()} ${d.getMonth()+1} ${d.getFullYear()}`; 
            try {
                // try to read file
                await fs.promises.readFile(`./logs/MessageLog/messageLog - ${dat}.txt`)
                const text = fs.readFileSync(`./logs/MessageLog/messageLog - ${dat}.txt`).toString();
    
                fs.writeFile(`./logs/MessageLog/messageLog - ${dat}.txt`, `${d.toLocaleTimeString()} § ${guild} § ${message.author.username}§ ${content}` + '\n' + `${text}`, err => {
                    if (err) throw err;
                });
              } catch (error) {
                // create empty file, because it wasn't found
                await fs.promises.writeFile(`./logs/MessageLog/messageLog - ${dat}.txt`, `${d.toLocaleTimeString()} § ${guild} § ${message.author.username}§ ${content}` + '\n', err => {
                    if (err) throw err;
                });
            }
        }
    })
}
