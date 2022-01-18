const memberCounter = require('../../Stats/memberCounter');
const language = require('../language/language')
const fs = require('fs');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js')
const Commando = require('discord.js-commando')
const economy = require('../../economy')
const tempmsg = require('../misc/temporary-message');
const { MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons')
const icons = require('../icon/icon')
const commandStats = require('../../Stats/commandStats');
const emojiCharacters = require('../reaction/emojiCharacters');
const boticons = require('../reaction/boticons');
module.exports = class HelpCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'blackjack',
            aliases: ['black', 'gamble'],
            group: 'games',
            memberName: 'blackjack',
            description: `༺play a round of blackjack༻`,
            argsType: 'multiple',
            guildOnly: true,
            format: 'blackjack',
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            userPermissions: ['SEND_MESSAGES'],
            examples: ['-blackjack 100'],
            guarded: true
        })
    
    }

    async run(message, args) {
        message.delete();
        const { guild } = message
        const user = message.author;
        const gambleamount = args[0];
        const coinsOwned = await economy.getCoins(guild.id, user.id)
        if (!args[0] || gambleamount) {
            return tempmsg(message.channel, 'Specify a amount to gamble for', 5);
        }
        if (coinsOwned < gambleamount) return tempmsg(message.channel, `You don't have that many erlingcoins.`, 5);
        const remainingCoins = await economy.addCoins(
            guild.id,
            user.id,
            gambleamount * -1
        )
        var suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
        var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

        var deck = new Array();
        let currentplayer = 0;
        var rules = `Please decide what to do in the following 60 seconds or you will lose!
        🔴 Stand | not asking for more cards.
        🔵 Hit | get another card.
        ⛔ Surrender | Get half of your bet back.`

        function createDeck() {
            deck = new Array();
            values.forEach((value) => {
                suits.forEach((suit) => {
                    var weight = parseInt(value);
                    if (value == "J" || value == "Q" || value == "K") {
                        weight = 10;
                    }
                    if (value == "A") {
                        weight = 11;
                    }
                    var card = { Value: value, Suit: suit, Weight: weight };
                    deck.push(card)
                })
            })
        }
        function shuffle() {
            for (var i = 0; i < 1000; i++) {
                var location1 = Math.floor((Math.random() * deck.length));
                var location2 = Math.floor((Math.random() * deck.length));
                var temp = deck[location1];

                deck[location1] = deck[location2];
                deck[location2] = temp;
            }
        }
        function getPoints(player)
        {
            var points = 0;
            for(var i = 0; i < players[player].Hand.length; i++)
            {
                points += players[player].Hand[i].Weight;
            }
            players[player].Points = points;
            return points;
        }

        function updatePoints()
        {
            for (var i = 0 ; i < players.length; i++)
            {
                getPoints(i);
            }
        }
        var players = new Array();
        function createPlayers(num) {
            players = new Array();
            // for (var i = 0; i < num; i++) {
            //     var hand = new Array();
            //     var player = { Name: "Player " + i, Id: i, Points: 0, Hand: hand };
            //     players.push(player);
            // }
            for (var i = 0; i < num; i++) {
                if (i === 1) {
                    var hand = new Array();
                    var player = { Name: "Dealer", Id: i, Points: 0, Hand: hand };
                    players.push(player);
                } else {
                    var hand = new Array();
                    var player = { Name: `${user.username}#${user.discriminator}`, Id: i, Points: 0, Hand: hand };
                    players.push(player);
                }
            }
        }
        function dealHands() {
            // alternate handing cards to each player
            // 2 cards each
            for (var i = 0; i < 2; i++) {
                for (var x = 0; x < players.length; x++) {
                    var card = deck.pop();
                    players[x].Hand.push(card);
                    updatePoints();
                }
            }
            // updateDeck();
            createPlayersUI();
        }
        async function createPlayersUI() {
            const embed = new MessageEmbed()
                .setTitle("Blackjack")
                .setTimestamp()
            let txt = ""
            for (var i = 0; i < players.length; i++) {
                let usertxt = `${players[i].Name === 'Dealer' ? '🕵️‍♂️' : '👨‍🦰'} (**${players[i].Points}** points) | ${players[i].Name} **your** cards are:\n`
                for (let c = 0; c < players[i].Hand.length; c++) {
                    usertxt += `**${players[i].Hand[c].Value}** of ${players[i].Hand[c].Suit}\n`
                }
                txt += `${usertxt}\n`;

            }   
            
            txt += `\n${rules}`
            embed.setDescription(txt)
            let messageEmbed = message.channel.send({ embeds: [embed]}).then((msg) => {
                msg.react('🔴')
                msg.react('🔵')
                msg.react('⛔')
                const filter = (reaction, user) => {
                    return user.id === message.author.id
                }
                const collector = msg.createReactionCollector({
                    filter,
                    max: 1,
                    time: 1000 * 60
                })
        
                collector.on('collect', (reaction) => {
                    console.log(reaction.emoji.name)
                    if (reaction.emoji.name == '🔵') {
                        hit();
                    }
                    if (reaction.emoji.name == '🔴') {
                        stay();
                    }
                    if (reaction.emoji.name == '⛔') {
                        surrender();
                    }
                })
        
                collector.on('end', (collected) => {
                    //console.log(collected)
                })
            })
            

        }
        async function startBlackjack() {
            currentplayer = 0;
            createDeck();
            shuffle();
            createPlayers(2);
            dealHands();
        }

        currentplayer = 0;
        function hit() {
            // pop a card from the deck to the current player
            // check if current player new points are over 21
            var card = deck.pop();
            players[currentplayer].Hand.push(card);

            
            updatePoints();
            check();
        }
        async function surrender() {
            const remainingCoins = await economy.addCoins(
                guild.id,
                member.id,
                gambleamount / 2
            )
            return tempmsg(message.channel, `You surrendered. Here is half your gambled money back.`, 5)
        }

        function check() {
            if (players[currentplayer].Points > 21) {
                const embed = new MessageEmbed()
                    .setTitle("Blackjack")
                    .setTimestamp()
                let txt = [];
                
                txt.push(`${players[currentplayer].Name} lost!\n`);
                for (var i = 0; i < players.length; i++) {

                    txt.push(`${players[i].Name === 'Dealer' ? '🕵️‍♂️' : '👨‍🦰'} (**${players[i].Points}** points) | ${players[i].Name} **your** cards are:`)
                    for (let c = 0; c < players[i].Hand.length; c++) {
                        txt.push(`**${players[i].Hand[c].Value}** of ${players[i].Hand[c].Suit}`)
                    }
                    txt.push(``);
                }
                embed.setDescription(txt.join('\n'))
                let messageEmbed = message.channel.send({ embeds: [embed]})
                // end(); 
            } else {
                const embed = new MessageEmbed()
                    .setTitle("Blackjack")
                    .setTimestamp()
                let txt = ""
                for (var i = 0; i < players.length; i++) {
                    let usertxt = `${players[i].Name === 'Dealer' ? '🕵️‍♂️' : '👨‍🦰'} (**${players[i].Points}** points) | ${players[i].Name} **your** cards are:\n`
                    for (let c = 0; c < players[i].Hand.length; c++) {
                        usertxt += `**${players[i].Hand[c].Value}** of ${players[i].Hand[c].Suit}\n`
                    }
                    txt += `${usertxt}\n`;

                }   
                txt += rules
                embed.setDescription(txt)
                let messageEmbed = message.channel.send({ embeds: [embed]}).then((msg) => {
                    msg.react('🔴')
                    msg.react('🔵')
                    const filter = (reaction, user) => {
                        return user.id === message.author.id
                    }
                    const collector = msg.createReactionCollector({
                        filter,
                        max: 1,
                        time: 1000 * 60
                    })
            
                    collector.on('collect', (reaction, user) => {
                        console.log(reaction.emoji.name)
                        if (reaction.emoji.name == '🔵') {
                            hit();
                        }
                        if (reaction.emoji.name == '🔴') {
                            stay();
                        }
                        if (reaction.emoji.name == '⛔') {
                            surrender();
                        }
                    })
            
                    collector.on('end', (collected) => {
                        //console.log(collected)
                    })
                })
            }
        }
        function stay() {
            if (currentplayer != players.length-1) {
                currentplayer += 1
                var card = deck.pop();
                players[currentplayer].Hand.push(card);

                
                updatePoints();
                check();
            } else {
                end();
            }
        }

        function end() {
            var winner = -1;
            var score = 0;

            const embed = new MessageEmbed()
                .setTitle("Blackjack")
                .setTimestamp()
            let txt = [];
            
            for (var i = 0; i < players.length; i++) {
                if (players[i].Points > score && players[i].Points < 22) {
                    winner = i;
                    txt.push(`${players[winner].Name} you won!\n`);
                }
                score = players[i].Points;

                
                txt.push(`${players[i].Name === 'Dealer' ? '🕵️‍♂️' : '👨‍🦰'} (**${players[i].Points}** points) | ${players[i].Name} **your** cards are:`)
                for (let c = 0; c < players[i].Hand.length; c++) {
                    txt.push(`**${players[i].Hand[c].Value}** of ${players[i].Hand[c].Suit}`)
                }
                txt.push(``);
            }

            embed.setDescription(txt.join('\n'))
            messageEmbed = message.channel.send({ embeds: [embed]})

        }
        startBlackjack();
    }
}