const settingsSchema = require('../../schemas/settings-schema')
const language = require('../language/language')

const settings = async (message, category) => {
    const { guild } = message
    const guildId = guild.id
    let result = await settingsSchema.findOne({
        guildId
    })
    if (!result) {
        result = await new settingsSchema({
            guildId
        }).save()
    }
    const categories = {
        moderation: result.moderation,
        ticket: result.ticket,
        swearfilter: result.swearfilter,
        emotes: result.emotes,
        money: result.money,
        currency: result.currency,
        antijoin: result.antijoin,
        welcome: result.welcome
    }
    for (const key in categories) {
        if (category == key) {
            return categories[key]
        }
    }
}
const settingsguild = async (guild, category) => {
    let guildId = guild
    if (Number.isNaN(guild)) {
        console.log('is not a number')
        guildId = guild.id
    }

    //if (!guildId) return
    let result = await settingsSchema.findOne({
        guildId
    })
    if (!result) {
        result = await new settingsSchema({
            guildId
        }).save()
    }
    const categories = {
        moderation: result.moderation,
        ticket: result.ticket,
        swearfilter: result.swearfilter,
        emotes: result.emotes,
        money: result.money,
        currency: result.currency,
        antijoin: result.antijoin,
        welcome: result.welcome
    }
    for (const key in categories) {
        if (category == key) {
            return categories[key]
        }
    }
}



module.exports.settingsguild = settingsguild;

module.exports.setting = settings;
