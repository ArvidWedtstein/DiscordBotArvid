const settingsSchema = require('../../schemas/settings-schema')
const color = require('./icons.json')
const Discord = require('discord.js');
const client = require('../../main')
const guildIcons = {}

//Update Icons
const loadColors = async (client) => {
    for (const guild of client.guilds.cache) {
        const guildId = guild[0]
        const result = await settingsSchema.findOne({
            guildId: guildId
        })
        guildIcons[guildId] = result ? result.iconcolor : 'purple'
        
    }
}

const setColor = (guild, iconcolor) => {
    guildIcons[guild.id] = iconcolor.toLowerCase();
}


module.exports = (guild, emojiId) => {
    const selectedColor = guildIcons[guild.id];
    if (!color[selectedColor][emojiId]) {
        throw new Error(`Unknown color ID "${emojiId}"`)
    }
    

    return client.emojis.cache.find((e) => e.id === color[selectedColor][emojiId])     
    
}
module.exports.loadColors = loadColors;
module.exports.setColor = setColor;