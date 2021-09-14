const mongoose = require('mongoose')


const reqString = {
    type: String,
    required: true
}

const memeCountSchema = mongoose.Schema({
    id: reqString,
    memeCount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('meme-counts', memeCountSchema)