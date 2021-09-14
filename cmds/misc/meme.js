const fs = require('fs');
const Discord = require('discord.js');
const Commando = require('discord.js-commando')
const level = require('../../levels')
const language = require('../language/language')
const economy = require('../../economy')
module.exports = class MemeCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'meme',
            group: 'misc',
            memberName: 'meme',
            description: 'get a random meme',
            throttling: {
				usages: 1,
				duration: 10,
			},
            guildOnly: true
        })
    }
    async run(message, args) {
        message.delete()
        let page = 0;
        const { guild } = message;
        const memeFiles = fs.readdirSync('./memes').filter(file => file.endsWith('.png'));
        const number = memeFiles.length + 2

        const guildId = message.guild.id;
        const userId = message.author.id;
        //level.addXP(guildId, userId, 9, message)

        /*let color = await economy.getColor(guildId, userId);
        const minus = '➖'
        const plus = '➕'
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`Meme`)
            .setFooter(`Meme ${page}/${number}`)

        let messageEmbed = await message.channel.send({embed}).catch((err) => {
            console.error(err);
        });


        messageEmbed.react(plus);

        let memearray = [];
        for (let i = 0; i < number; i++) {
            memearray.push(i)
        }
    
        this.client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == message.channel.id) {
                if (reaction.emoji.name == plus) {
                    await reaction.users.remove(user.id);
                    //let imageNumber = Math.floor(Math.random()*(number - 1 + 1));
                    let imageNumber = memearray[Math.floor(Math.random() * memearray.length)];
                    function removeItemOnce(arr, value) {
                        var index = arr.indexOf(value);
                        if (index > -1) {
                        arr.splice(index, 1);
                        }
                        return arr;
                    }
                    removeItemOnce(memearray, imageNumber)
                    //console.log(memearray)
                    let attachment = new Discord.MessageAttachment(`./memes/${imageNumber}.png`, `${imageNumber}.png`);
                    //message.channel.send('test', {files: ["./memes/" + imageNumber + ".png"]} );
                    let embed2 = new Discord.MessageEmbed()
                        .setColor(color)
                        .setTitle(`Meme`)
                        .attachFiles(attachment)
                        .setImage(`attachment://${imageNumber}.png`)
                        .setFooter(`Meme ${imageNumber}/${number}`)
                    let messageEmbed2 = await message.channel.send(embed2).catch((err) => {
                        console.error(err);
                    });
                    messageEmbed2.react(plus);
                    
                    return
                } else {
                    await reaction.users.remove(user.id);
                }
            } else {
                return;
            }
        });*/

        //message.channel.send ({files: ["./memes/" + imageNumber + ".png"]} );

        let imageNumber = Math.floor (Math.random() * (number - 1 + 1));
       
        const attachment = new Discord.MessageAttachment(`./memes/${imageNumber}.png`, `${imageNumber}.png`);
        
        let embed2 = new Discord.MessageEmbed()
            .setColor('ff4300')
            .setTitle('Here is your requested meme')
            .attachFiles(attachment)
            .setImage(`attachment://${imageNumber}.png`)

        let messageEmbed = message.channel.send(embed2).catch((err) => {
            console.error(err);
        });

    }
}
