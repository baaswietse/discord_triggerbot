const Users = require('../models/Users')

module.exports = {
    name: 'trigger',
    description: 'Trigger a bot',
    args: true,
    usage: '[user name]',
    async execute(message, args) {
        try {
            if (message.mentions.users.size) {
                const mention = message.mentions.users.first()
                const userData = {
                    user_id: mention.id,
                    username: mention.username,
                }

                let user = await Users.findOne({
                    user_id: userData.user_id
                })

                console.log(user)
                if (user == null) {
                    user = await Users.create(userData)
                    user.triggers.push({
                        date: new Date(),
                        mentionedBy: message.author.id
                    })
                    await user.save()
                } else {
                    user.triggers.push({
                        date: new Date(),
                        mentionedBy: message.author.id
                    })
                    await user.save()
                }

                console.log(user)
                const userTriggers = user.triggers.length
                message.channel.send(`<@${user.user_id}> has been triggered ${userTriggers} times`)

            } else {
                message.reply('please mention a user')
            }
        } catch (err) {
            message.channel.send(err.msg)
        }
    }
}