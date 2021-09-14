const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}
const settingsSchema = mongoose.Schema({
    guildId: reqString,
    emotes: {
        type: Boolean,
        default: true,
    },
    money: {
        type: Boolean,
        default: true,
    },
    ticket: {
        type: Boolean,
        default: true,
    },
    swearfilter: {
        type: Boolean,
        default: true,
    },
    moderation: {
        type: Boolean,
        default: true,
    },
    currency: {
        type: String,
        default: 'ErlingCoin'
    },
    antijoin: {
        type: Boolean,
        default: false,
    },
    welcome: {
        type: Boolean,
        default: false
    },
    iconcolor: {
        type: String,
        default: "purple"
    }
})

module.exports = mongoose.model('settings', settingsSchema)