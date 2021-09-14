const fs = require('fs');
const Discord = require('discord.js');
const { colors, fonts, texturemaps, carbrands } = require('./fast-type-words.json');
const language = require('../language/language')
const commandStats = require('../../Stats/commandStats')

const example = {
    channelId: {
        message: 'message object',
        stage: 'string',
        counter: 'number',
        currentWord: 'string',
        shuffledWord: 'string',
        remainingWords: ['words here'],
        points: {
            userId: 'points'
        }
    }
}

const games = {}

const stages = {
    STARTING: (counter) => {
        return `A new "fast type" game is starting in ${counter}s!`
    },
    IN_GAME: (word) => {
        let spacedWord = ''

        // hello
        // ['h', 'e', 'l', 'l', 'o']

        for (const character of [...word]) {
            spacedWord += character
            spacedWord += ' '
        }

        return `The new word is **${spacedWord}**!`
    },
    ENDING: (points) => {
        const sorted = Object.keys(points).sort((a, b) => {
            return points[b] - points[a]
        })

        let results = ''

        for (const key of sorted) {
            const amount = points[key]
            results += `<@${key}> had ${amount} point${amount === 1 ? '' : 's'}\n`
        }

        return `The game is now over Here's how everyone did:\n\n${results}------------------------`
    }
}

const selectWord = (game) => {
    
    game.currentWord = game.remainingWords[Math.floor(Math.random() * game.remainingWords.length)]
    let currentword = []
    let shuffledword = []
    for (var i = 0; i < game.currentWord.length; i++) {
        currentword.push(game.currentWord.charAt(i))
        shuffledword.push(game.currentWord.charAt(i))
    }
    shuffle(shuffledword);
    game.shuffledWord = shuffledword.join("")
    game.currentWord = currentword.join("")

    const index = game.remainingWords.indexOf(game.currentWord)
    game.remainingWords.splice(index, 1)
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    array.join("")
    return array;
}

  
const gameLoop = () => {
    for (const key in games) {
        const game = games[key]
        const { message, stage } = game

        if (stage === 'STARTING') {
            let string = stages[stage](game.counter)
            message.edit(string)

            if (game.counter <= 0) {
                game.stage = 'IN_GAME'
                game.counter = 120

                selectWord(game)

                string = stages[game.stage](game.shuffledWord)
                message.edit(string)
            }
        } else if (stage === 'IN_GAME') {
            if (game.counter <= 0) {
                game.stage = 'ENDING'

                const string = stages[game.stage](game.points)
                message.edit(string)

                delete games[key]

                continue
            } else if (game.remainingWords <= 0) {
                game.stage = 'ENDING'

                const string = stages[game.stage](game.points)
                message.edit(string)

                delete games[key]

                continue
            }
        }
        --game.counter
    }
    setTimeout(gameLoop, 1000)
}

const Commando = require('discord.js-commando')

module.exports = class FastTypeCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'fasttype',
            aliases: ['game'],
            group: 'games',
            memberName: 'fasttype',
            description: 'starts a fasttype game',
            guildOnly: true,
            userPermissions: ['SEND_TTS_MESSAGES']
        })

        this.client.on('message', message => {
            const { channel, content, member } = message
            const { id } = channel
        
            const game = games[id]
            
        
            if (game && game.currentWord && !member.user.bot && game.shuffledWord) {
                //console.log('GAME')
                message.delete()

        
                if (game.stage === 'IN_GAME' && content.toLowerCase() === game.currentWord.toLowerCase()) {
                    game.currentWord = null
                    game.shuffledWord = null
                    const seconds = 2
        
                    const { points } = game
                    points[member.id] = points[member.id] || 0
        
                    message.reply(`You won! +1 point (${++points[member.id]} total)`).then(newMessage => {
                        newMessage.delete({
                            timeout: 1000 * seconds
                        })
                    })
                    
                    setTimeout(() => {
                        if (game.stage === 'IN_GAME') {
                            selectWord(game)
        
                            const string = stages[game.stage](game.shuffledWord)
                            game.message.edit(string)
                        }
                    }, 1000 * seconds)
                }
            }
        })  
    }

    async run(message, args) {
        const { channel } = message
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'fasttype')
        const nmb = ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣']
        let embed = new Discord.MessageEmbed()
        .setColor('ff4300')
        .setTitle(`Fast Type Game`)
        .setDescription(`${language(guild, 'FASTTYPE_CATEGORY')}`)
        .addFields(
            {name: nmb[0], value: 'Colors'},
            {name: nmb[1], value: `Fonts`},
            {name: nmb[2], value:`Texturemaps`},
            {name: nmb[3], value: `Carbrands`},
            {name: nmb[4], value: `None`},
            {name: nmb[5], value: `None`},
            {name: nmb[6], value: `None`}
        )
        let messageEmbed = await message.channel.send(embed)
        Promise.all([
            messageEmbed.react(nmb[0]),
            messageEmbed.react(nmb[1]),
            messageEmbed.react(nmb[2]),
            messageEmbed.react(nmb[3]),
            messageEmbed.react(nmb[4]),
            messageEmbed.react(nmb[5]),
            messageEmbed.react(nmb[6])
        ])
        
        
        

        function startGame(category) {
            channel.send('Preparing game...').then((message) => {
                games[channel.id] = {
                    message,
                    stage: 'STARTING',
                    counter: 3,
                    remainingWords: [...category],
                    points: {
        
                    }
                }
            })
        }
        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == message.channel.id) {
                switch (reaction.emoji.name) {
                    case nmb[0]:
                        message.delete()
                        messageEmbed.delete()
                        await reaction.users.remove(user.id);
                        channel.send('Preparing game...').then((message) => {
                            games[channel.id] = {
                                message,
                                stage: 'STARTING',
                                counter: 3,
                                remainingWords: [...colors],
                                points: {
                    
                                }
                            }
                        })
                        break;
                    case nmb[1]:
                        message.delete()
                        messageEmbed.delete()
                        await reaction.users.remove(user.id);
                        channel.send('Preparing game...').then((message) => {
                            games[channel.id] = {
                                message,
                                stage: 'STARTING',
                                counter: 3,
                                remainingWords: [...fonts],
                                points: {
                    
                                }
                            }
                        })
                        break;
                    case nmb[2]:
                        message.delete()
                        messageEmbed.delete()
                        await reaction.users.remove(user.id);
                        channel.send('Preparing game...').then((message) => {
                            games[channel.id] = {
                                message,
                                stage: 'STARTING',
                                counter: 3,
                                remainingWords: [...texturemaps],
                                points: {
                    
                                }
                            }
                        })
                        break;
                    case nmb[3]:
                        message.delete()
                        messageEmbed.delete()
                        await reaction.users.remove(user.id);
                        channel.send('Preparing game...').then((message) => {
                            games[channel.id] = {
                                message,
                                stage: 'STARTING',
                                counter: 3,
                                remainingWords: [...carbrands],
                                points: {
                    
                                }
                            }
                        })
                        break;
                    case nmb[4]:
                        
                        break;
                    case nmb[5]:
                        
                        break;
                    case nmb[6]:
                        
                        break;
                }
            } else {
                return;
            }
        });
        /*channel.send('Preparing game...').then((message) => {
            games[channel.id] = {
                message,
                stage: 'STARTING',
                counter: 3,
                remainingWords: [...words],
                points: {
    
                }
            }
        })*/


        gameLoop()
    }
}