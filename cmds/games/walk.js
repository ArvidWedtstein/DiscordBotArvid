const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const Commando = require('discord.js-commando')
const commandStats = require('../../Stats/commandStats')
module.exports = class WalkGameCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'walk',
            aliases: ['walkgame'],
            group: 'games',
            memberName: 'walk',
            description: 'walk',
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
        })
    }

    async run(message, args) {
        const { guild, member, content } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'walk')
        const dir = []
        const emojis = ['862055723172495370', '862055782467633172', '859394250868916235', '859394294061072384']
        for (let i = 0; i < emojis.length; i++) {
            let emoji = this.client.emojis.cache.find((e) => e.id === emojis[i])
            dir.push(emoji)
        }
        message.delete()
        const grass = '🟩'
        const water = '🟦'
        const house = '🏡'
        const mapsprites = {
            house: '🏡',
            water: '🟦',
            ocean: '🌊',
            grass: '🟩',
            wheat: '🌾'
        }
        let line1 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩']
        let line2 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩']
        let line3 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🏡', '🟩', '🟩', '🟩', '🟦', '🟦', '🟩', '🟩']
        let line4 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟦', '🟦', '🌊', '🟦', '🟩']
        let line5 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🌊', '🌊', '🟦', '🟦', '🟩']
        let line6 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟦', '🟦', '🟩', '🟩']
        let line7 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩']
        let line8 = ['🟩', '🟩', '🌾', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩']
        let line9 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩']
        let line10 = ['🟩', '🟩', '🌾', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩']
        let line11 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩']
        let line12 = ['🟩', '🟩', '🟩', '🌾', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩']
        let line13 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🌾', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩']
        let line14 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩']
        let line15 = ['🟩', '🟩', '🟩', '🟩', '🟩', '🟩', '🌾', '🟩', '🟩', '🟩', '🟩', '🟩', '🟩']
        /*let line1 = ['O', 'O', 'O', 'O', 'O', 'O', 'O']
        let line2 = ['O', 'O', 'O', 'O', 'O', 'O', 'O']
        let line3 = ['O', 'O', 'O', 'O', 'O', 'O', 'O']
        let line4 = ['O', 'O', 'O', 'O', 'O', 'O', 'O']
        let line5 = ['O', 'O', 'O', 'O', 'O', 'O', 'O']
        let line6 = ['O', 'O', 'O', 'O', 'O', 'O', 'O']
        let line7 = ['O', 'O', 'O', 'O', 'O', 'O', 'O']*/
        let y = [line1, line2, line3, line4, line5, line6, line7, line8, line9, line10, line11, line12, line13, line14, line15]
        //let player = '♻️'
        let player = message.guild.emojis.cache.find((e) => e.name === message.author.username)
        if (!player) {
            const url = message.author.avatarURL()
            const name = message.author.username;
            message.guild.emojis
            .create(url, name)
            player = message.guild.emojis.cache.find((e) => e.name === message.author.username)
        }
        
        
        //let player = message.guild.emojis.cache.find((e) => e.name === message.author.username)
        let pos = [3, 3] // x - y
        let cacheMaterial = y[pos[1]][pos[0]] 
        y[pos[1]][pos[0]] = player
        
        //console.log(y[pos[1]][pos[0]])
        let field = [line1.join(""), line2.join(""), line3.join(""), line4.join(""), line5.join(""), line6.join(""), line7.join(""), line8.join(""), line9.join(""), line10.join(""), line11.join(""), line12.join(""), line13.join(""), line14.join(""), line15.join("")]
        //await message.channel.send(`${msg.join('')}\n${msg.join('')}\n${msg.join('')}\n${msg.join('')}\n${msg.join('')}\n${msg.join('')}\n${msg.join('')}`)
        let msg = await message.channel.send(`${field.join("\n")}`)
        msg.react(dir[0])
        msg.react(dir[1])
        msg.react(dir[2])
        msg.react(dir[3])

        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == message.channel.id) {
                //if (reaction.message.id != message.id) return
                await reaction.users.remove(user.id);
                console.log(pos[1], pos[0])
                let cacheMaterial = y[pos[1]][pos[0]] 
                if (pos[0] == 12) {
                    pos[0] == 12
                }
                if (pos[0] == 0) {
                    pos[0] = 0
                }
                if (pos[1] == 15) {
                    pos[1] == 15
                }
                if (pos[1] == 0) {
                    pos[1] = 0
                }
                switch (reaction.emoji) {
                    case dir[0]: 
                        cacheMaterial = y[pos[1] - 1][pos[0]]
                        y[pos[1]][pos[0]] = cacheMaterial
                        pos[1] -= 1
                        y[pos[1]][pos[0]] = player
                        field = [line1.join(""), line2.join(""), line3.join(""), line4.join(""), line5.join(""), line6.join(""), line7.join(""), line8.join(""), line9.join(""), line10.join(""), line11.join(""), line12.join(""), line13.join(""), line14.join(""), line15.join("")]
                        reaction.message.edit(field.join('\n'))
                    break;
                    case dir[1]:
                        cacheMaterial = y[pos[1] + 1][pos[0]]
                        y[pos[1]][pos[0]] = cacheMaterial
                        pos[1] += 1
                        y[pos[1]][pos[0]] = player
                        field = [line1.join(""), line2.join(""), line3.join(""), line4.join(""), line5.join(""), line6.join(""), line7.join(""), line8.join(""), line9.join(""), line10.join(""), line11.join(""), line12.join(""), line13.join(""), line14.join(""), line15.join("")]
                        reaction.message.edit(field.join('\n'))
                    break;
                    case dir[2]:
                        cacheMaterial = y[pos[1]][pos[0] - 1]
                        console.log(cacheMaterial)
                        y[pos[1]][pos[0]] = cacheMaterial
                        pos[0] -= 1
                        y[pos[1]][pos[0]] = player
                        field = [line1.join(""), line2.join(""), line3.join(""), line4.join(""), line5.join(""), line6.join(""), line7.join(""), line8.join(""), line9.join(""), line10.join(""), line11.join(""), line12.join(""), line13.join(""), line14.join(""), line15.join("")]
                        reaction.message.edit(field.join('\n'))
                    break;
                    case dir[3]:
                        cacheMaterial = y[pos[1]][pos[0] + 1]
                        y[pos[1]][pos[0]] = cacheMaterial
                        pos[0] += 1
                        y[pos[1]][pos[0]] = player
                        field = [line1.join(""), line2.join(""), line3.join(""), line4.join(""), line5.join(""), line6.join(""), line7.join(""), line8.join(""), line9.join(""), line10.join(""), line11.join(""), line12.join(""), line13.join(""), line14.join(""), line15.join("")]
                        reaction.message.edit(field.join('\n'))
                    break;
                }
                
            }
        })
    }
}