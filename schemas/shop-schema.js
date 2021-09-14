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
const item = {
    name: '',
    icon: '',
    amount: 1
}

const shopSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    shopname: reqString,
    items: {
        type: [Object],
        required: true,
    },
    //slots: reqNumber
})

module.exports = mongoose.model('shops', shopSchema)