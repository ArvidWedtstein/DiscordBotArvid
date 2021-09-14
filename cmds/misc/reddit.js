const fs = require('fs');
const Discord = require('discord.js');
const Commando = require('discord.js-commando')
const level = require('../../levels')
const economy = require('../../economy')
const commandStats = require('../../Stats/commandStats')
const api = require("imageapi.js")
module.exports = class RedditCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'reddit',
            group: 'misc',
            memberName: 'reddit',
            description: 'get a random meme from reddit',
            throttling: {
				usages: 30,
				duration: 1800,
			},
        })
    }
    async run(message, args) {
        message.delete()
        const { guild } = message
        const guildId = guild.id
        commandStats.cmdUse(guildId, 'reddit')
        let subreddits = [
            "comedyheaven",
            "dank",
            "nsfw",
            "meme",
            "memes"
        ]
        let subreddit = subreddits[Math.floor(Math.random()*(subreddits.length))]
        console.log(subreddit)
        let img = await api(subreddit)

        const embedreddit = new Discord.MessageEmbed()
            .setTitle(`Meme`)
            .setURL(`https://reddit.com/r/${subreddit}`)
            .setColor('RANDOM')
            .setImage(img)
        message.channel.send(embedreddit)
    }
}
