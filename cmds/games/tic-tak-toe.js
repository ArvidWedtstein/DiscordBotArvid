const fs = require('fs');
const Discord = require('discord.js');
const language = require('../language/language')
const { MessageAttachment } = require('discord.js'); 
const Commando = require('discord.js-commando')
const games = {}
//const Canvas = require("canvas")
const path = require('path')
const commandStats = require('../../Stats/commandStats')
let msg = '';
const gamespots = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:']
let spots1 = []
var transform = {
    1: ':one:',
    2: ':two:',
    3: ':three:',
    4: ':four:',
    5: ':five:',
    6: ':six:',
    7: ':seven:',
    8: ':eight:',
    9: ':nine:'
}
/*var transform = {
    1: '1⃣',
    2: '2⃣',
    3: '3⃣',
    4: '4⃣',
    5: '5⃣',
    6: '6⃣',
    7: '7⃣',
    8: '8⃣',
    9: '9⃣'
}*/
module.exports = class TicTacToeCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'tictactoe',
            aliases: ['ttt'],
            group: 'games',
            memberName: 'tictactoe',
            description: 'challenge a user to a tictactoe duell!',
            guildOnly: true,
            userPermissions: ['SEND_MESSAGES']
        })
        
        this.client.on('message', async (message) => {
            if (message.channel.type == 'dm') return
            const { channel, content, member, guild } = message
            commandStats.cmdUse(guild.id, 'tictactoe')
            if (message.author.bot) return
            const { id } = channel
            const game = games[id]
            if (content == 'end' || content == 'stop') {
                game.stage = 'end'
                message.reply('stopped game')
            }
            if (!game) return
            if (game.stage == 'end') return
            if (Number.isNaN(content)) return
            if (game.spots.length = 0) return message.reply('Tie!');
            

            /*const canvas = Canvas.createCanvas(300, 300)
            const ctx = canvas.getContext('2d');
            let x = 0;
            let y = 0;*/


            await field(game, content)
            async function field (game, spot) {
                // 1 2 3
                // 4 5 6
                // 7 8 9
                
                if (spots1[0] == '❌' && spots1[1] == '❌' && spots1[2] == '❌' || 
                    spots1[0] == '❌' && spots1[3] == '❌' && spots1[6] == '❌' || 
                    spots1[1] == '❌' && spots1[4] == '❌' && spots1[7] == '❌' ||
                    spots1[2] == '❌' && spots1[5] == '❌' && spots1[8] == '❌' ||
                    spots1[3] == '❌' && spots1[4] == '❌' && spots1[5] == '❌' ||
                    spots1[6] == '❌' && spots1[7] == '❌' && spots1[8] == '❌' ||
                    spots1[0] == '❌' && spots1[5] == '❌' && spots1[8] == '❌' ||
                    spots1[2] == '❌' && spots1[5] == '❌' && spots1[6] == '❌') {
                    message.delete()
                    game.stage = 'end'
                    return message.reply(`${game.p1} wins!`)
                } else if (spots1[0] == '⭕' && spots1[1] == '⭕' && spots1[2] == '⭕' || 
                    spots1[0] == '⭕' && spots1[3] == '⭕' && spots1[6] == '⭕' || 
                    spots1[1] == '⭕' && spots1[4] == '⭕' && spots1[7] == '⭕' ||
                    spots1[2] == '⭕' && spots1[5] == '⭕' && spots1[8] == '⭕' ||
                    spots1[3] == '⭕' && spots1[4] == '⭕' && spots1[5] == '⭕' ||
                    spots1[6] == '⭕' && spots1[7] == '⭕' && spots1[8] == '⭕' ||
                    spots1[0] == '⭕' && spots1[5] == '⭕' && spots1[8] == '⭕' ||
                    spots1[2] == '⭕' && spots1[5] == '⭕' && spots1[6] == '⭕') {
                    message.delete()
                    game.stage = 'end'


                    return message.reply(`${game.p2} wins!`)

                    
                }
                
                if (game.stage == 'end') return

                if (!game.gamespots.includes(transform[content])) return message.reply('Not correct number');
                if (message.author.username === game.p1) {
                    if (game.turn === game.p2) return message.reply('it is not your turn')
                    game.turn = game.p2
                    spots1 = game.gamespots
                    //spots1 = spots1[spot].replace(`${spot}`, "❌")
                    spots1.splice(spots1.indexOf(transform[spot]), 1, "❌");
                    msg = `${spots1[0]} ${spots1[1]} ${spots1[2]}\n${spots1[3]} ${spots1[4]} ${spots1[5]}\n${spots1[6]} ${spots1[7]} ${spots1[8]}`
                    let embed2 = new Discord.MessageEmbed()
                        .setColor('ff4300')
                        .setAuthor(`Turn: ${game.p2}`)
                        .setTitle(`Tic Tac Toe`)
                        .setDescription(`${msg}`)
                        .setFooter('Write a number to mark your spot')

                    message.channel.send(embed2)
                    /*const background = await Canvas.loadImage(
                        path.join(__dirname, './image.png')
                    )
                    ctx.drawImage(background, x, y)

                    const invslot = await Canvas.loadImage(
                        path.join(__dirname, `../../img/ErlingMoney.png`)
                    )
                    let spot2 = spot
                    let spot3 = spot
                    let u = (canvas.width / 3) - 75
                    let i = (canvas.height / 3) - 75
                    if (spot < 4) {
                        spot2 = 1
                    } else if (spot > 3 && spot < 7) {
                        spot2 = 2
                    } else if (spot > 6 && spot < 10) {
                        spot2 = 3
                    }
                    if (spot == 1 || spot == 4 || spot == 6) {
                        spot3 = 1
                    } else if (spot == 2 || spot == 5 || spot == 8) {
                        spot3 = 2
                    } else if (spot == 3 || spot == 6 || spot == 9) {
                        spot3 = 3
                    }
                    ctx.drawImage(invslot, (spot3 * 100) - 75, (spot2 * 100) - 75, 50, 50);
                    

                    const attachment = new MessageAttachment(canvas.toBuffer(), 'test.png')
                    const buffer = canvas.toBuffer('image/png')
                    fs.writeFileSync('./cmds/games/image.png', buffer)
                    message.channel.send(attachment)*/
                    
                    const remove = [`${transform[spot]}`]
                    console.log(remove)
                    
                } else if (message.author.username === game.p2) {
                    if (game.turn === game.p1) return message.reply('it is not your turn')
                    game.turn = game.p1
                    spots1 = game.gamespots
                    
                    //spots1 = spots1[spot].replace(`${spot}`, "⭕")
                    spots1.splice(spots1.indexOf(transform[spot]), 1, "⭕");
                    msg = `${spots1[0]} ${spots1[1]} ${spots1[2]}\n${spots1[3]} ${spots1[4]} ${spots1[5]}\n${spots1[6]} ${spots1[7]} ${spots1[8]}`
                    //msg = spots1.join('\n')
                    let embed2 = new Discord.MessageEmbed()
                        .setColor('ff4300')
                        .setAuthor(`Turn: ${game.p1}`)
                        .setTitle(`Tic Tac Toe`)
                        .setDescription(`${msg}`)
                        .setFooter('Write a number to mark your spot')
                    
                    message.channel.send(embed2)
                    
                    /*const background = await Canvas.loadImage(
                        path.join(__dirname, './image.png')
                    )
                    ctx.drawImage(background, x, y)
                    const invslot = await Canvas.loadImage(
                        path.join(__dirname, `../../img/goldcoin.png`)
                    )
                    let spot2 = spot
                    let spot3 = spot
                    let u = (canvas.width / 3) - 75
                    let i = (canvas.height / 3) - 75
                    if (spot == 1 || spot == 2 || spot == 3) {
                        spot2 = 1
                    } else if (spot == 4 || spot == 5 || spot == 6) {
                        spot2 = 2
                    } else if (spot == 7 || spot == 8 || spot == 8) {
                        spot2 = 3
                    }
                    if (spot == 1 || spot == 4 || spot == 6) {
                        spot3 = 1
                    } else if (spot == 2 || spot == 5 || spot == 8) {
                        spot3 = 2
                    } else if (spot == 3 || spot == 6 || spot == 9) {
                        spot3 = 3
                    }
                    ctx.drawImage(invslot, (spot2 * 100) - 75, (spot3 * 100) - 75, 50, 50);
                    

                    const attachment = new MessageAttachment(canvas.toBuffer(), 'test.png')
                    const buffer = canvas.toBuffer('image/png')
                    fs.writeFileSync('./cmds/games/image.png', buffer)
                    message.channel.send(attachment)*/
                    const remove = [`${transform[spot]}`]
                    console.log(remove)
                    game.spots = game.spots.filter(item => !remove.includes(item))
                }                
            }
        })  
    }

    async run(message, args) {
        const { channel } = message
        if (!message.mentions.users.first()) {
            return message.reply('Please specify your enemy')
        }
        const p1 = message.author.username
        const p2 = message.mentions.users.first().username
        //if (!p1) return
        const { guild } = message
        if (!p2) {
            return message.reply('Please specify your enemy')
        }
        //const spots = [' 1   2   3 ', ' 4   5   6 ', ' 7   8   9 ']
        //const spots = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
        //const spots = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣']
        const spots = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:']

        //msg = spots.join('\n')
        msg = `${spots[0]} ${spots[1]} ${spots[2]}\n${spots[3]} ${spots[4]} ${spots[5]}\n${spots[6]} ${spots[7]} ${spots[8]}`

        
        
        let embed = new Discord.MessageEmbed()
            .setColor('ff4300')
            .setTitle(`Tic Tac Toe`)
            .setDescription(`${msg}`)
            .setFooter('Write a number to mark your spot')

        let messageEmbed = await message.channel.send(embed)
        
        games[channel.id] = {
            message,
            stage: 'game',
            messageEmbed,
            spots: spots,
            gamespots: gamespots,
            p1,
            p2,
            turn: p1
        }
        console.log(games[channel.id].spots)

    }
}