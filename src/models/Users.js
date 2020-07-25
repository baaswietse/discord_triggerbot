const mongoose = require('mongoose')

const Schema = mongoose.Schema

let user = new Schema(
    {
        user_id: {
            type: String
        },
        username: {
            type: String
        },
        triggers: [{date: Date, mentionedBy: String}]
    },
    { collection: 'users' }
)

module.exports = mongoose.model('users', user)