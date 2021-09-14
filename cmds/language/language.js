const languageSchema = require('../../schemas/language-schema')
const lang = require('./lang.json')
const Discord = require('discord.js');

const guildLanguages = {}

//Update Languages
const loadLanguages = async (client) => {
    for (const guild of client.guilds.cache) {
        const guildId = guild[0]
        const result = await languageSchema.findOne({
            guildId: guildId
        })
        guildLanguages[guildId] = result ? result.language : 'english'
        
    }
}

const setLanguage = (guild, language) => {
    guildLanguages[guild.id] = language.toLowerCase();
}


module.exports = (guild, textId) => {
    if (!lang.translations[textId]) {
        throw new Error(`Unknown text ID "${textId}"`)
    }
    const selectedLanguage = guildLanguages[guild.id];

    return lang.translations[textId][selectedLanguage]     
    
}
module.exports.loadLanguages = loadLanguages;
module.exports.setLanguage = setLanguage;