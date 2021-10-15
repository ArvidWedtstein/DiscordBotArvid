const fs = require('fs');
require('dotenv').config();
const Discord = require('discord.js');
const language = require('../language/language');
const Commando = require('discord.js-commando');
const config = require('../../config.json');
const tempMsg = require('../misc/temporary-message');
const boticons = require('../reaction/boticons');
const commandStats = require('../../Stats/commandStats');
const axios = require('axios');
module.exports = class SteamCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'steam',
            aliases: ['steamuser'],
            group: 'features',
            memberName: 'steam',
            description: 'get a steam users information',
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
            
        let key = '1410E8FADF0939759C782AB4E6F9DC96'
        let arvidid = '76561198920818256'
        let stianid = '76561198095314013'
        let larserikid = '76561198315631561'
        let chrisid = '76561197984596436'
        let ravanid = '76561198938956853'
        let skyrim = '489830'
        // brawlhalla 291550
        // dartdazer id 76561198135719149
        // Player achievements:  http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=440&key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&steamid=76561197972495328
        // Owned games: http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=XXXXXXXXXXXXXXXXX&steamid=76561197960434622&format=json
        // Get user stats for game  http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=440&key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&steamid=76561197972495328
        // Get friends list: http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&steamid=76561197960435530&relationship=friend
        // Get player summaries: http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=XXXXXXXXXXXXXXXXXXXXXXX&steamids=76561197960435530
        /*axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=76561198135719149&format=json`).then(async (res) => {
            
            console.log(res.data.response.games[3]);
            for (let i = 0; i < res.data.response.games.length; i++) {
                    await axios.get(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${res.data.response.games[i].appid}&key=${key}&steamid=76561198135719149`).then(async (res2) => {
                    if (res2.data.playerstats) {
                        console.log(res2.data.playerstats.gameName)
                        console.log(res2.data.playerstats.achievements[0]);
                    }
                    
                    
                }).catch((err2) => {
                    //console.error('Err2:', err2.response.data.playerstats);
                })
            }
            
        }).catch((err) => {
            console.error('Err:', err);
        })*/
        axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${args[0]}`).then(async (res) => {
            let desc = '';
            console.log(res.data.response.players);
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Steamprofile for ${res.data.response.players[0].personaname}`, res.data.response.players[0].avatar)
                .setThumbnail(res.data.response.players[0].avatarfull)
                .setURL(res.data.response.players[0].profileurl)
                if (res.data.response.players[0].realname) {
                    desc += `**Real Name**: ${res.data.response.players[0].realname}\n`
                }
                if (res.data.response.players[0].gameextrainfo) {
                    desc += `**Currently Playing**: ${res.data.response.players[0].gameextrainfo}\n`
                }
                desc += `**Steam ID**: ${res.data.response.players[0].steamid}`
                desc += `**Country**: ${res.data.response.players[0].loccountrycode}`
                embed.setDescription(desc)
            channel.send(embed)
        }).catch((err) => {
            console.error('Err:', err);
        })

    }
}