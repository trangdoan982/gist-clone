const { ObjectID } = require('bson')
const mongoose = require('mongoose')


const Gist = mongoose.model('Gist', {
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = Gist