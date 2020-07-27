const Discord = require('discord.js')
const redditPost = require('../utils/redditRandomPostMedia')
const nfetch = require('node-fetch')
const gifResize = require('@gumlet/gif-resize')

const {
    promisify
} = require('util')
const {
    writeFile,
    readFileSync,
    unlinkSync
} = require('fs')
const writeFilePromise = promisify(writeFile)

module.exports = {
    name: 'reddit',
    description: 'Get a random image or gif from the specified subreddit, __reddit surprise__ for a random NSFW post',
    args: true,
    usage: '[subreddit name]',
    cooldown: 0,
    async execute(message, args) {
        if (args.length) {
            let mediaUrl = ''
            if (args[0] == 'surprise') {
                const subreddits = ['nsfw', 'amateur', 'amateurcumsluts', 'amateurporn', 'anal', 'besthqporngifs', 'boobbounce', 'collegesluts', 'drunkgirls', 'girlsdoingstuffnaked', 'gonewild', 'godpussy', 'homemadensfw', 'hotfallingdevilz', 'lanarhoades', 'lipsthatgrip', 'nsfw_gifs', 'pussy', 'unexpectedtitty', 'womenbendingover']
                args[0] = subreddits[Math.floor(Math.random() * subreddits.length)]
            }
            try {
                mediaUrl = await redditPost(args)
                await message.channel.send(`r/${args[0]}`, {
                    files: [mediaUrl],
                    dynamic: true
                })
            } catch (error) {
                // gif downloaden en herschalen wanneer bestand te groot
                if (error.message = 'Request entity too large') {
                    message.channel.send('... resizing gif')
                    resizeGif(message, mediaUrl, `r/${args[0]}`)
                } else {
                    message.channel.send(error.message)
                }
            }
        }
    }
}

async function resizeGif(message, mediaUrl, sub) {
    const filename = /([^\/]+$)/.exec(mediaUrl)[0]
    try {
        nfetch(mediaUrl)
            .then(x => x.arrayBuffer())
            .then(x => writeFilePromise(filename, Buffer.from(x)))
            .then(() => {
                const buf = readFileSync(filename)
                gifResize({
                        width: 400
                    })(buf).then(data => {
                        writeFilePromise('output_' + filename, Buffer.from(data))
                    })
                    .then(async () => {
                        await message.channel.send(sub, {
                            files: ['./output_' + filename]
                        })
                    }).then(() => {
                        unlinkSync(filename)
                        unlinkSync('./output_' + filename)
                    })
            })
    } catch (e) {
        message.channel.send('e.message')
    }
}