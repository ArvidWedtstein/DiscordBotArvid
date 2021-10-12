const fs = require('fs');
require('dotenv').config();
const Discord = require('discord.js');
const language = require('../language/language');
const Commando = require('discord.js-commando');
const config = require('../../config.json');
const tempMsg = require('../misc/temporary-message');
const boticons = require('../reaction/boticons');
const commandStats = require('../../Stats/commandStats');
const { Octokit } = require("@octokit/core");
module.exports = class Command extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'github',
            aliases: ['repository'],
            group: 'stats',
            memberName: 'github',
            description: 'github',
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
        const { guild, channel, author } = message;
        const guildId = guild.id;
        commandStats.cmdUse(guildId, `${this.name}`);
        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    
        const response = await octokit.request("GET /repos/{owner}/{repo}", {
            owner: "ArvidWedtstein",
            repo: "ScreenMessageSolution",
        });
        console.log(response.data);

        let embed = new Discord.MessageEmbed()
            .setAuthor(`${response.data.name}`, response.data.owner.avatar_url)
            .setTitle(`${response.data.full_name}`)
            .setURL(`${response.data.html_url}`)
            .setDescription(`${response.data.description}`)
            .addField(`Created at:`, `${response.data.created_at}`)
            .addField(`Language: `, `${response.data.language}`)
            .addField(`Subscribtions: `, `${response.data.subscribers_count}`)
        if (response.data.open_issues >= 1) {
            embed.addField(`Issues: `, `${response.data.open_issues}`)
        }
        channel.send(embed);
    }
}