const Discord = require('discord.js')
const redditPost = require('../utils/redditRandomPostMedia')


module.exports = {
    name: 'reddit',
    description: 'Get a random image or gif from the specified subreddit, __reddit surprise__ for a random NSFW post',
    args: true,
    usage: '[subreddit name]',
    cooldown: 0,
    async execute(message, args) {
        if (args.length) {
            if (args[0] == 'surprise') {
                const subreddits = ['nsfw', 'amateur', 'amateurcumsluts', 'amateurporn', 'anal', 'besthqporngifs', 'boobbounce', 'collegesluts', 'drunkgirls', 'girlsdoingstuffnaked', 'gonewild', 'godpussy', 'homemadensfw', 'hotfallingdevilz', 'lanarhoades', 'lipsthatgrip', 'nsfw_gifs', 'pussy', 'unexpectedtitty', 'womenbendingover']
                args[0] = subreddits[Math.floor(Math.random() * subreddits.length)]
            }
            try {
                const media = await redditPost(args)
                message.channel.send(`r/${args[0]}`, {
                    files: [media],
                    dynamic: true
                })
            } catch (error) {
                message.channel.send(error.message)
            }
        }
    }
}