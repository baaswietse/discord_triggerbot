/* eslint-disable indent */
const Users = require('./models/Users')
const asyncForEach = require('async-await-foreach')
const redditFetch = require('./modules/reddit-fetch')
const defineProbability = require('define-probability')

const prefix = process.env.PREFIX || ''
const addTriggerCommand = `${prefix}trigger`
const returnTriggersCommand = `${prefix}triggerstats`

const commands = {}

commands.yikes = async function (message) {
    if (message.content.toLowerCase().includes('yikes')) {
        const probabilities = [{
                value: true,
                prob: .4
            },
            {
                value: false,
                prob: .6
            }
        ]
        const probability = defineProbability(probabilities)
        if (probability) {
            message.reply('that\'s a yikes for me dawg')
        }
    }
}

commands.ohn = async function (message) {
    if (/o+hn/i.exec(message.content)) {
        const probabilities = [{
                value: true,
                prob: .4
            },
            {
                value: false,
                prob: .6
            }
        ]
        const probability = defineProbability(probabilities)
        if (probability) {
            message.reply('ooooohn')
        }
    }
}

commands.neig = async function (message) {
    if (/ne+ig/i.exec(message.content)) {
        const probabilities = [{
                value: true,
                prob: .4
            },
            {
                value: false,
                prob: .6
            }
        ]
        const probability = defineProbability(probabilities)
        if (probability) {
            message.reply('ohn neeeeeig')
        }
    }
}


commands.sletje = async function (message) {
    if (message.content.toLowerCase().includes('sletje')) {
        message.reply('ooohn neig')
    }
}

commands.reddit = async function (message) {
    try {
        console.log(message.content.toLowerCase())
        if (message.content.toLowerCase() == `${prefix}reddit surprise`) {
            const subreddits = ['nsfw', 'amateur', 'amateurcumsluts', 'amateurporn', 'anal', 'besthqporngifs', 'boobbounce', 'collegesluts', 'drunkgirls', 'girlsdoingstuffnaked', 'gonewild', 'godpussy', 'homemadensfw', 'hotfallingdevilz', 'lanarhoades', 'lipsthatgrip', 'nsfw_gifs', 'pussy', 'unexpectedtitty', 'whooties', 'womenbendingover']
            let post = {}
            let sub = ''
            while (!('url_overridden_by_dest' in post)) {
                sub = subreddits[Math.floor(Math.random() * subreddits.length)]
                let resp = await redditFetch({
                    subreddit: sub,
                    sort: 'best',
                    allowNSFW: true,
                    allowModPost: true,
                    allowCrossPost: true,
                })
                if ('url_overridden_by_dest' in resp) {
                    if (
                        (
                            resp.url_overridden_by_dest.includes('.jpg') ||
                            resp.url_overridden_by_dest.includes('.gif') ||
                            resp.url_overridden_by_dest.includes('.png')
                        ) && !resp.url_overridden_by_dest.includes('.gifv')) {
                        post = resp
                    }

                }
            }
            message.channel.send(`r/${sub}`, {
                files: [post.url_overridden_by_dest]
            })
        }
        if (message.content.replace(/[ ].*$/, '').toLowerCase() == `${prefix}reddit` && message.content.toLowerCase() != `${prefix}reddit surprise`) {
            let post = {}
            while (!('url_overridden_by_dest' in post)) {
                let resp = await redditFetch({
                    subreddit: /[ ].*$/.exec(message.content)[0].trim(),
                    sort: 'best',
                    allowNSFW: true,
                    allowModPost: true,
                    allowCrossPost: true,
                })
                if ('url_overridden_by_dest' in resp) {
                    if (
                        (
                            resp.url_overridden_by_dest.includes('.jpg') ||
                            resp.url_overridden_by_dest.includes('.gif') ||
                            resp.url_overridden_by_dest.includes('.png')
                        ) && !resp.url_overridden_by_dest.includes('.gifv')) {
                        post = resp
                    }

                }
            }
            console.log(post)
            message.channel.send({
                files: [post.url_overridden_by_dest]
            })
        }
    } catch (err) {
        message.channel.send(err.message)
    }
}

commands.animeTiddies = async function (message) {
    // https://www.reddit.com/r/animetitties.json?sort=best&t=year&limit=100
    if (message.content.toLowerCase().includes('anime tidies')) {
        let post = {}
        while (!('url_overridden_by_dest' in post)) {
            post = await redditFetch({
                subreddit: 'animetitties',
                sort: 'best',
                allowNSFW: true,
                allowModPost: true,
                allowCrossPost: true,

            })
        }
        message.channel.send('Oooohn neig', {
            files: [post.url_overridden_by_dest]
        })
        console.log(post)
    }

}

commands.whamen = async function (message) {
    const whamen = ['whamen', 'vrouwen', 'meisjes', 'bitches', 'teven', 'teef', 'woman', 'cumbucket', '<@!247106993335042048>', 'cumcontainer', 'women', 'hoeren', 'objecten', 'oenjers', 'slettenbakken', 'sleddes', 'wasmachines', 'gianni']
    console.log(message.content)
    whamen.forEach((queen) => {
        if (message.content.toLowerCase().includes(queen)) {
            if (message.content.toLowerCase() === 'gianni' || message.content.toLowerCase().includes('<@!247106993335042048>')) {
                message.channel.send('<@247106993335042048> tzijn aal teven of coifeusen') //@ Gianni
            } else {
                message.reply('tzijn aal teven of coifeusen')
            }
        }
    })

}

commands.nigger = async function (message) {
    const niggers = ['nigger', 'negro', 'nignog', 'neegro', 'kneegrow', 'neger']
    niggers.forEach((nigger) => {
        if (message.content.toLowerCase().includes(nigger)) {
            message.reply('we are a Christian server!')
        }
    })
}

commands.urMomGay = async function (message) {
    if (message.content.includes('gay'.toLowerCase())) {
        message.reply('No u!')
    }
}

commands.addTrigger = async function (message) {
    try {
        if (message.content.replace(/[ ].*$/, '').toLowerCase() == addTriggerCommand) {
            const mentionsData = message.mentions.users.array()
            // There are one or more users @mentions
            if (mentionsData.length > 0) {
                const mentions = mentionsData.map(el => {
                    const user = {
                        user_id: el.id,
                        username: el.username,
                        mentionedBy: message.author.id
                    }
                    return user
                })
                console.log(mentions)

                // all @ mentioned users
                await asyncForEach(mentions, async mention => {
                    const user = await Users.findOne({
                        user_id: mentions[0].user_id
                    })
                    // user bestaat nog niet => aanmaken
                    if (user === null) {
                        const newUser = await Users.create(mentions[0])
                        newUser.triggers.push({
                            date: new Date(),
                            mentionedBy: mentions[0].mentionedBy
                        })
                        await newUser.save()
                    } else {
                        user.triggers.push({
                            date: new Date(),
                            mentionedBy: mentions[0].mentionedBy
                        })
                        await user.save()
                    }

                    const userTriggers = await getNumberOfTriggers(mention.user_id)
                    message.channel.send(`<@${mention.user_id}> has been triggered ${userTriggers} times`)
                })

                // No @ mentions
            } else {
                await message.channel.send('no "@" mention\nFor a list of all supported commands type: "triggerhelp"')
            }
        }
    } catch (err) {
        await message.channel.send(err.message || 'Unknown error')
    }
}

commands.returnTriggersForUser = async function (message) {
    try {
        if (message.content.replace(/[ ].*$/, '').toLowerCase() == returnTriggersCommand) {
            const mentionsData = message.mentions.users.array()
            if (mentionsData.length > 0) {

                const userTriggers = await getNumberOfTriggers(mentionsData[0].id)
                message.channel.send(`<@${mentionsData[0].id}> has been triggered ${userTriggers} times`)
            }
        }
    } catch (err) {
        await message.channel.send(err.message || 'Unknown error')
    }
}

commands.returnAllTriggers = async function (message) {
    try {
        if (message.content.replace(/[ ].*$/, '').toLowerCase() == returnTriggersCommand) {
            const mentionsData = message.mentions.users.array()
            if (mentionsData.length == 0) {
                const users = await Users.find({})
                if (users.length > 0) {
                    let response = 'All triggered bots: \n'
                    await asyncForEach(users, async user => {
                        const userTriggers = await getNumberOfTriggers(user.user_id)
                        response = response + `> <@${user.user_id}> has been triggered ${userTriggers} times\n`
                    })
                    await message.channel.send(response)
                } else {
                    await message.channel.send('No triggered bots')
                }
            }
        }
    } catch (err) {
        await message.channel.send(err.message || 'Unknown error')
    }
}

commands.listAllCommands = async function (message) {
    if (message.content.toLowerCase() == 'triggercommands' || message.content.toLowerCase() == 'triggerhelp') {
        const commands = `A list of all supported commands:
        > **trigger** *@user: triggers a user*
        > **triggerstats** *@user: gets the triggered stats of a user*
        > **triggerstats**: *gets the triggered stats of all users*
        > **reddit** *subreddit: returns a random image or gif for given subreddit*
        > **reddit surprise**: *returns an image or gif from a random NSFW subreddit*
        > **anime tidies**: *oooohn*
        > **gay**: *No u!*
        > **sletje**: *ooohn neig*
        > **ohn**: *ooohn*
        > **neig**: *neeeeig*
        > **yikes**: *that's a yikes for me dawg*
        > **nigger synonyms**
        > **whamen synonyms**
        `
        await message.channel.send(commands)
    }
}

async function getNumberOfTriggers(user_id) {
    try {
        const user = await Users.findOne({
            user_id
        })
        if (user) return user.triggers.length
        return 0
    } catch (err) {
        console.log(err)
    }
}

module.exports = commands