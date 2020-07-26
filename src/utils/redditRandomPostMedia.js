const nfetch = require('node-fetch')

async function redditPostToEmbed(args) {
    return new Promise(async (resolve, reject) => {
        nfetch(`https://www.reddit.com/r/${args[0]}.json?sort=best&t=week&limit=100`).then(res => res.json()).then(body => {
            if (!body.data) return reject(new Error('subreddit not found'))
            if (body.data.children.length === 0) return reject(new Error('subreddit not found'))

            let images = []
            const posts = body.data.children
            console.log(posts.length)
            for (const post of posts) {
                const text = post.data
                const extension = ['.jpg', '.png', '.svg', '.gif']

                if (extension.includes(text.url.slice(-4))) {
                    images.push(text.url)
                    console.log('text', text.url)
                }
            }
            var image = images[Math.floor(Math.random() * images.length)]
            resolve(image)
        })
    })
}
module.exports = redditPostToEmbed