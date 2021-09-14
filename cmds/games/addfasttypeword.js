const fs = require('fs');
const Discord = require('discord.js');
const tempmsg = require('../misc/temporary-message')
const words = require('./fast-type-words.json');
const language = require('../language/language')
const Commando = require('discord.js-commando')

module.exports = class AddFastTypeWordCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'addfasttypeword',
            aliases: ['+fasttypeword'],
            group: 'games',
            memberName: 'addfasttypeword',
            description: 'add a word to the fasttype game',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR']
        })
    }

    async run(message, args) {
        message.delete();
        const guildId = message.guild.id
        const word = args[1]
        const category = args[0]
        let wo = []
        fs.readFile("./commands/games/fast-type-words.json", async (err, data) => {
            if (err) throw err;
            
            let test = JSON.parse(data)

            let tlt = `test.${category}`
            
            for (i = 0; i < tlt.toString().length; i++) {
                wo.push(tlt.toString()[i])
            }
            wo.push(word)
            const wor = {
                words: wo
            }
            
    
            fs.writeFile("./commands/games/fast-type-words.json", JSON.stringify(wor, null, 4), err => {
                if (err) throw err;
                
            })
            tempmsg(message.channel, `Successfully added word "${word}"`, 5)
        })
    }
}