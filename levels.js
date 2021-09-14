const mongo = require('./mongo')
const profileSchema = require('./schemas/profileschema')
const economy = require('./economy')
const Discord = require('discord.js');
const language = require('./cmds/language/language')
const fs = require('fs');
let messagecache = ''
//let xps = 0;

module.exports = (client) => {
    client.on('message', (message) => {
        const { guild, member } = message
        if (message.author.bot) {
            return
        }
        
        if (!guild) {
            return;
        }
        
        /*if (xps >= 100) {
            message.author.send('You have reached maximum xp per minute.')
            setTimeout(function() {
                xps = 0;
                //addXP(guild.id, member.id, 5, message)
                
                //console.log(xps)
                return;
            }, 1000 * 60)
        } else if (xps < 100) {
            xps += 5
            //console.log(xps)
            addXP(guild.id, member.id, 5, message)
        }*/
        if (messagecache == message.content) {
            return
        } else {
            addXP(guild.id, member.id, 8, message)
        }
        messagecache = message.content;


        
    })
}

/*const addEveryMinute = () => {
    client.guilds.cache.forEach((guild) => {
        guild.members.cache.forEach((member) => {
            addXP(guild.id, member.id, 1)
        })
    })
    setTimeout(addEveryMinute, 1000 * 60)
}
addEveryMinute()*/

//const getNeededXP = (level) => level * level * 100
const getNeededXP = (level) => {
    let levle = level / 10
    return levle * levle * 210
}




const addXP = async (guildId, userId, xpToAdd, message) => {
    
    const { guild, member } = message
    //console.log('added xp')
    const result = await profileSchema.findOneAndUpdate(
        {
            guildId, 
            userId,
        },
        {
            guildId,
            userId,
            $inc: {
                xp: xpToAdd
            },
        }, 
        {
            upsert: true,
            new: true,
        }
    )
    let userlevels = []
    const levels = fs.readFileSync(`./cmds/level/userlevels.json`).toString();
    userlevels = JSON.parse(levels); //now it an object
    

    let { xp, level } = result
    let needed = getNeededXP(level)
    let checklevel = level + 10;
    //console.log(userlevels[Object.keys(userlevels)[Object.keys(userlevels).length - 1]])
    if (checklevel >= userlevels[Object.keys(userlevels)[Object.keys(userlevels).length - 1]]) {
        //console.log('return')
        return
    }
    // Level Up
    if (xp >= needed) {
        
        //console.log('level up')
        if (guildId == '524951977243836417') {
            for (const [key, value] of Object.entries(userlevels)) {
                if (!guild.roles.cache.find(r => r.id === value)) {
                    return;
                }
                //console.log(key)
                if (key == level) {
                    member.roles.remove(value);
                } 
                
            }
            level += 10;
            for (const [key, value] of Object.entries(userlevels)) {
                if (key == level) {
                    member.roles.add(value);
                }
            }
        } else {
            level += 10;
        }
        

        //xp -= needed   
        let moneyresult = needed / 100
        const moneyReward = (Math.round(moneyresult)); 
        await economy.addCoins(guildId, userId, moneyReward)
        message.reply(`${language(guild, 'LEVEL_UP')} ${level} (${xp}xp)!\n${language(guild, 'LEVEL_UP2')} ${moneyReward} ErlingCoins!\n${language(guild, 'LEVEL_UP3')} ${getNeededXP(level)} XP ${language(guild, 'LEVEL_UP4')}.`).then(msg => {
            msg.delete({
                timeout: 20000,
            })
        })

        await profileSchema.findOneAndUpdate({
            guildId,
            userId,
        }, {
            level,
            xp
        })

    }
}


module.exports.getLevel = async (guildId, userId) => {
    //console.log('Running findOne()')

    const result = await profileSchema.findOne({
        guildId,
        userId
    })
    //console.log(result)

    let level = '';
    if (result) {
        level = result.level
    } else {
        console.log('Adding new user to database')
        await new profileSchema({
            guildId,
            userId,
            level
        }).save()
    }

    return level
}
module.exports.getXP = async (guildId, userId) => {
    const result = await profileSchema.findOne({
        guildId,
        userId
    })
    //console.log(result)

    let xp = '';
    if (result) {
        xp = result.xp
    } else {
        console.log('Adding new user to database')
        await new profileSchema({
            guildId,
            userId,
            xp
        }).save()
    }

    return xp
}

module.exports.addXP = addXP;

//module.exports.levels = userlevels;