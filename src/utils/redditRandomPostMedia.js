const nfetch = require('node-fetch')
const fs = require('fs')
let logger = require('./logger')

let lastIndex = 0
let prevposts = []

async function redditPostToEmbed(args) {
    return new Promise(async (resolve, reject) => {
        nfetch(`https://www.reddit.com/r/${args[0]}.json?limit=100`).then(res => res.json()).then(async body => {
            if (!body.data) return reject(new Error('subreddit not found'))
            if (body.data.children.length === 0) return reject(new Error('subreddit not found'))

            let images = []
            const posts = body.data.children
            //fs.writeFileSync('test.json', JSON.stringify(posts))
            logger.info.bright.blue('Returned posts: ', posts.length)
            for (const post of posts) {
                const text = post.data
                const extension = ['.jpg', '.png', '.svg', '.gif']

                if (text.media) {
                    if (text.media.oembed) {
                        if (text.media.oembed.thumbnail_url) {
                            if (extension.includes(text.media.oembed.thumbnail_url.slice(-4))) {
                                images.push(text.media.oembed.thumbnail_url)
                            }
                        }
                    }
                } else if (extension.includes(text.url.slice(-4))) {
                    images.push(text.url)
                }
            }
            // console.log(images)
            logger.info.bright.blue('Valid media: ', images.length)

            let index = Math.floor(Math.random() * images.length)
            var image = images[index]

            if (args[0].toLowerCase() == 'timonsimp') {
                if (prevposts.length < images.length) {
                    while (prevposts.includes(image)) {
                        index = Math.floor(Math.random() * images.length)
                        image = images[index]
                    }
                } else {
                    prevposts = []
                }
                prevposts.push(image)
            }

            resolve(image)
        })
    })
}
module.exports = redditPostToEmbed