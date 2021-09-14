const mongoose = require('mongoose')


const reqString = {
    type: String,
    required: true
}
const welcomeSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    text: {
        type: String,
        required: true,
        default: 'Information'
    },
    rules: {
        type: Object,
        required: true
    },
    verifyrole: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('rules', welcomeSchema)