const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const tempMsg = require('../misc/temporary-message')
const boticons = require('../reaction/boticons')
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const c = require('ansi-colors')
const commandStats = require('../../Stats/commandStats')
module.exports = class CommandStatsCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'commandstats',
            aliases: ['cs'],
            group: 'stats',
            memberName: 'commandstats',
            description: 'view command stats',
            userPermissions: ['ADD_REACTIONS'],
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
            guildOnly: true,
            guarded: false
        })
    }

    async run(message, args) {
        const guildId = message.guild.id;
        commandStats.cmdUse(guildId, `${this.name}`);
        const cmds = []
        const cmdstxt = []
        const readCommands = (dir) => {
            const files = fs.readdirSync(path.join(__dirname, dir))
            for (const file of files) {
                const stat = fs.lstatSync(path.join(__dirname, dir, file))
                if (stat.isDirectory()) {
                    readCommands(path.join(dir, file))
                } else if (file !== 'load-commands.js') {
                    cmds.push(file)
                    cmdstxt.push(path.join(__dirname, dir, file))
                }
    
            }
        }
        
        readCommands('../')
        const filecount = cmds.length
        
        // console.log(cmds)
        function lineCount( text ) {
            var nLines = 0;
            for( var i = 0, n = text.length;  i < n;  ++i ) {
                if( text[i] === '\n' ) {
                    ++nLines;
                }
            }
            return nLines;
        }
        let totalchars = 0;
        let totallines = 0;
        for (let i = 0; i < cmdstxt.length; i++) {
            let text = fs.readFileSync(cmdstxt[i]).toString();
            let lines = lineCount(text);
            totallines += lines
            totalchars += text.length
        }
        let averagelines = totallines / filecount
        
        let embed = new Discord.MessageEmbed()
            .setDescription(`Total Files: ${filecount}\nTotal Lines of Code: ${totallines}\nAverage Lines of Code: ${Math.round(averagelines)}\nTotal Characters: ${totalchars}`)
        message.channel.send(embed)
        //console.log(`${c.bgBlack(`Total Files: ${c.redBright(filecount)}`)}\n${c.bgBlack(`Total Lines of Code: ${c.redBright(totallines)}`)}\n${c.bgBlack(`Average Lines of Code: ${c.redBright(Math.round(averagelines))}`)}\n${c.bgBlack(`Total Characters: ${c.redBright(totalchars)}`)}`)
    }
}