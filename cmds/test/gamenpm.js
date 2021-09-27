
const Discord = require('discord.js')
class Game {
    constructor(q, a) {
        this.game = q;
        this.emoji = a;
    }
}

var games;
let membersjoined = []

exports.log_games = function () {
    console.log(games);
}

exports.get_games = function () {
    return games;
}

exports.create_game = function (message, game, emoji, embed_color="0000ff") {
    games = new Game (game, emoji)
    if (!Discord.Message.prototype.isPrototypeOf (message))
        return console.error ('"message" must be of type Message from discord.js');

    if (typeof game != 'string') {
        return console.error('"game" must be a string');
    }
    if (typeof time != 'number')
        return console.error ('"time" must be a number.');
    
    var q = games
    let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`${q.game}\n\nCurrent Members: ${membersjoined.length}\n\nPress ${q.emoji} if you want to join`)
        .setTimestamp()
        .setColor(embed_color)
    message.channel.send(embed).then (async msg => {
        await msg.react(q.emoji);

        message.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == msg.channel.id) {
                if (reaction._emoji.id == q.emoji.match(/[0-9]/g).join('')) {
                    const guild = reaction.message.guild;
                    const member = guild.members.cache.get(user.id)
                    membersjoined.push(member.user.username)
                    let embed2 = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setDescription(`${q.game}\n\nCurrent Members: ${membersjoined.length}\n\nPress ${q.emoji} if you want to join`)
                    for (let x = 0; x < membersjoined.length; x++) {
                        embed2.addField(membersjoined[x], '👍', true)
                    }
                    msg = await msg.edit(embed2);
                }
            } else {
                return;
            }
        });
        message.client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == msg.channel.id) {
                if (reaction._emoji.id == q.emoji.match(/[0-9]/g).join('')) {
                    const guild = reaction.message.guild;
                    const member = guild.members.cache.get(user.id)
                    membersjoined = membersjoined.filter(item => item !== member.user.username)
                    let embed3 = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setDescription(`${q.game}\n\nCurrent Members: ${membersjoined.length}\n\nPress ${q.emoji} if you want to join`)
                    for (let x = 0; x < membersjoined.length; x++) {
                        embed3.addField(membersjoined[x], '👍', true)
                    }
                    msg = await msg.edit(embed3);
                }
            } else {
                return;
            }
        });
    })
}