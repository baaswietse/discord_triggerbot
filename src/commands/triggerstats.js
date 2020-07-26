const Users = require('../models/Users')

module.exports = {
    name: 'triggerstats',
    description: 'Get triggerstats for an @ mentioned user or when no @ mention, get all stats',
    async execute(message, args) {
        try {
            // Stats for an @ mentioned user
            if (message.mentions.users.size) {
                const mentionedUser = message.mentions.users.first()
                const user = await Users.findOne({
                    user_id: mentionedUser.id
                })
                if (!user) {
                    return message.channel.send(`<@${mentionedUser.id}> has been triggered 0 times`)
                }
                const userTriggers = user.triggers.length
                message.channel.send(`<@${mentionedUser.id}> has been triggered ${userTriggers} times`)
                // Stats for all user when no @mention
            } else {
                const users = await Users.find({})
                if (users.length > 0) {
                    users.sort((a, b) => b.triggers.length - a.triggers.length)
                    let response = 'All triggered bots: \n'
                    for (let user of users) {
                        const userTriggers = user.triggers.length
                        response = response + `> <@${user.user_id}> has been triggered ${userTriggers} times\n`
                    }
                    message.channel.send(response)
                } else {
                    message.channel.send('No triggered bots')
                }
                console.log('no user')
            }
        } catch (err) {
            message.channel.send(err.message)
            console.log(err)
        }
    }
}