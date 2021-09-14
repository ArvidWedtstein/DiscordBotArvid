const Discord = require('discord.js');
const mongo = require('../mongo')
const swearSchema = require('../schemas/swear-schema')
const swearFilterSchema = require('../schemas/swearfilter-schema')
const settingsSchema = require('../schemas/settings-schema')
module.exports = (client) => {

    

    //const { swearwords } = require("./swearwords.json");

    client.on('message', async (message) => {
        const { guild } = message
        if (!guild) {
            return
        } else {
            const guildId = guild.id

            if (message.author.bot) {
                //console.log('bot')
                return;
            } else {
                const wordresult = await swearFilterSchema.findOne({
                    guildId
                })
                if (!wordresult) {
                    return
                }
                if (wordresult.swearwords.length == null) {
                    return
                }
                for(var i = 0;i < wordresult.swearwords.length; i++) {
                    if(message.content.toLowerCase().includes(wordresult.swearwords[i].toLowerCase())) {
                        message.delete()
                        
                        
                        //const guildId = message.guild.id
                        const userId = message.author.id
    
                        const swearword = message.content
    
                        message.author.send(`Use of the word "${swearword}" is forbidden in ${message.guild.name}`);
                        
                        const swearing = {
                            timestamp: new Date().getTime(),
                            swearword
                        }
                        await swearSchema.findOneAndUpdate({
                            guildId,
                            userId
                        }, {
                            guildId,
                            userId,
                            $push: {
                                swear: swearing
                            }
                        }, {
                            upsert: true
                        })
                    }
                }
            } 
        }
    })
}
