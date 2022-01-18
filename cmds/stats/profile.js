const fs = require('fs');
const Discord = require('discord.js');
const economy = require('../../economy')
const messageCountSchema = require('../../schemas/message-count-schema')
const warnSchema = require('../../schemas/warn-schema')
const levels = require('../../levels')
const Commando = require('discord.js-commando')
const config = require('../../config.json')
const profileSchema = require('../../schemas/profileschema')
const commandStats = require('../../Stats/commandStats')
const boticons = require('../reaction/boticons');
module.exports = class ProfileCommand extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            aliases: ['p'],
            group: 'stats',
            memberName: 'profile',
            description: 'Your Profile',
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'ATTACH_FILES',
                'EMBED_LINKS',
                'MANAGE_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'VIEW_CHANNEL'
            ],
            guildOnly: true
        })
    }
    
    async run(message, args) {
        const userrole = message.guild.member(message.mentions.users.first() || message.author)
        const user = message.mentions.users.first() || message.author;
        const guildId = message.guild.id
        const userId = userrole.id  

        message.delete()
        commandStats.cmdUse(guildId, 'profile')
        

        let rolemap = userrole.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(r => r)
        .join(", \n");
        if (rolemap.length > 1024) rolemap = "To many roles to display";
        if (!rolemap) rolemap = "No roles";

        

    
        let xptonextlevel = ''

        function getLevel(test) {
            var n = test.split(" ")
            return n[n.length - 2] + n[n.length - 1];
        }


        const result = await messageCountSchema.findOne({ 
            guildId,
            userId
        })
        let messages = '';
        if (!result) {
            messages = '0'
        } else if (!result.messageCount) {
            messages = '0'
        } else {
            messages = result.messageCount;
        }
        let birthday = '';
        let joinedDate = '';
        const birthdayresult = await profileSchema.findOne({
            userId
        })
        if (!birthdayresult) {
            birthday = 'Unknown'
            joinedDate = 'Unknown'
        } else if (birthdayresult.birthday == '1/1') {
            birthday = 'Unknown'
        } else {
            birthday = birthdayresult.birthday;
            joinedDate = userrole.joinedAt;
        }
        let warntxt = '';
        const results = await profileSchema.findOne({
            userId,
            guildId
        })
        if (!results.warnings) {
            warntxt += 'No warns'
        } else {    
            //.addField(`Warned By ${author} for "${reason}"`, `on ${new Date(timestamp).toLocaleDateString()}`)
            for (const warning of results.warnings) {
                const { author, timestamp, reason } = warning
            
                let txt = `Warned By ${author} for "${reason}" on ${new Date(timestamp).toLocaleDateString()}\n`
                warntxt += txt
            }
        }
    
        // Get Animated ErlingCoin
        const erlingcoin = this.client.emojis.cache.get('853928115696828426');
        
        let presencegame = user.presence.activities.length ? user.presence.activities.filter(x=>x.type === "PLAYING") : null;
        let presence = `${presencegame && presencegame.length ? presencegame[0].name : 'None'}`
        let presencelength = user.presence.status
        //console.log(presencelength, user.presence.activities)

        if (presence.includes('Skyrim')) {
            presence += `${boticons(this.client, 'skyrim')}`
        }
        
        let Coins = await economy.getCoins(guildId, userId);
        let xp = await levels.getXP(guildId, userId);
        let userlevel = await levels.getLevel(guildId, userId);
        let xptonextlev = userlevel / 10
        xptonextlevel = xptonextlev * xptonextlev * 210
        let color = await economy.getColor(guildId, userId);
        const badge = user.flags.toArray()
        let txt = ''
        for (let i = 0; i < badge.length; i++) {
            let badges = this.client.emojis.cache.find((e) => e.name === badge[i])
            
            txt += `${badges}\n`
        }
        if (!txt) {
            txt += 'None'
        }
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(`${user.username}'s Profile`, `${user.displayAvatarURL({ dynamic: true})}`)
            //.addField('Joined Discord: ', user.createdAt)
        if (birthday) embed.addField('Birthday🎂: ', birthday, true)
        if (Coins) embed.addField(`ErlingCoin${Coins === 1 ? '' : 's'}${erlingcoin}: `, Coins)
        if (userlevel) embed.addField('Level:', userlevel, true)
        if (xp) embed.addField('XP: ', xp, true)
        if (xptonextlevel) embed.addField('XP To Next Level: ', xptonextlevel - xp, true)
        if (messages) embed.addField("Messages Sent: ", messages)
        if (txt) embed.addField("Badges: ", `${txt}`)
        if (presence) embed.addField("Game: ", `${presence}`)
        if (warntxt) embed.addField("Warns: ", warntxt)
        if (joinedDate) embed.addField("Has been in this server for: ", joinedDate)
        
        
        //.addField("Roles" , rolemap)
        let messageEmbed = await message.channel.send(embed);
    }
}