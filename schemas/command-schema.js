const { number } = require('mathjs')
const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
    default: 15
}


const commandSchema = mongoose.Schema({
    guildId: reqString,
    commands: {
        type: [Object],
        required: true,
    },
})

module.exports = mongoose.model('commands', commandSchema)