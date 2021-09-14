const mongoose = require('mongoose')

const testSchema = mongoose.Schema({
    test: {
        type: Boolean,
        required: true,
    }

})

module.exports = mongoose.model('test', testSchema)