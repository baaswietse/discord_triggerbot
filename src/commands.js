const Users = require('./models/Users')
const asyncForEach = require('async-await-foreach') 
const redditFetch = require('./modules/reddit-fetch')

const prefix = process.env.PREFIX || ''
const addTriggerCommand = `${prefix}trigger`
const returnTriggersCommand = `${prefix}triggerstats`

const commands = {}

commands.animeTiddies = async function(message){
    // https://www.reddit.com/r/animetitties.json?sort=best&t=year&limit=100
    if(message.content.toLowerCase().includes('anime tidies')){
        let post = {}
        while(!('url_overridden_by_dest' in post)){
            post = await redditFetch({
                subreddit: 'animetitties',
                sort: 'new',
                allowNSFW: true,
                allowModPost: true,
                allowCrossPost: true,
            
            })
        }
        message.channel.send('Oooohn neig', {files: [post.url_overridden_by_dest]})
        console.log(post)
    }

}

commands.whamen = async function(message){
    const whamen = ['whamen', 'vrouwen', 'meisjes', 'bitches', 'teven', 'teef', 'woman', 'cumbucket', '<@!247106993335042048>', 'cumcontainer', 'women', 'hoeren', 'objecten', 'oenjers','slettenbakken', 'sleddes','wasmachines', 'gianni']
    console.log(message.content)
    whamen.forEach((queen) =>{
        if(message.content.toLowerCase().includes(queen)){
            if(message.content.toLowerCase() === 'gianni' || message.content.toLowerCase().includes('<@!247106993335042048>')){
                message.channel.send('<@247106993335042048> tzijn aal teven of coifeusen')  //@ Gianni
            }else{
                message.reply('tzijn aal teven of coifeusen')
            }
        }
    })
    
}

commands.nigger = async function(message){
    const niggers = ['nigger', 'negro', 'nignog', 'neegro', 'kneegrow', 'neger']
    niggers.forEach((nigger) =>{
        if(message.content.toLowerCase().includes(nigger)){
            message.reply('we are a Christian server!')
        }
    })
}

commands.urMomGay = async function(message){
    if(message.content.includes('gay'.toLowerCase())){
        message.reply('No u!')
    }
}

commands.addTrigger = async function (message){
    try{
        if(message.content.replace(/[ ].*$/, '').toLowerCase() == addTriggerCommand){
            const mentionsData = message.mentions.users.array()
            // There are one or more users @mentions
            if(mentionsData.length > 0){
                const mentions = mentionsData.map(el=>{
                    const user = {
                        user_id: el.id,
                        username: el.username,
                        mentionedBy: message.author.id
                    }
                    return user
                })
                console.log(mentions)

                // all @ mentioned users
                await asyncForEach(mentions, async mention =>{
                    const user = await Users.findOne({user_id: mentions[0].user_id})
                    // user bestaat nog niet => aanmaken
                    if(user === null){
                        const newUser = await Users.create(mentions[0])
                        newUser.triggers.push({date: new Date(), mentionedBy: mentions[0].mentionedBy})
                        await newUser.save()
                    }else{
                        user.triggers.push({date: new Date(), mentionedBy: mentions[0].mentionedBy})
                        await user.save()
                    }

                    const userTriggers = await getNumberOfTriggers(mention.user_id)
                    message.channel.send(`<@${mention.user_id}> has been triggered ${userTriggers} times`)
                })
                
            // No @ mentions
            }else{
                await message.channel.send('no "@" mention')
            }
        }   
    }catch(err){
        await message.channel.send(err.message || 'Unknown error')
    }
}
  
commands.returnTriggersForUser = async function(message){
    try{
        if(message.content.replace(/[ ].*$/, '').toLowerCase() == returnTriggersCommand){
            const mentionsData = message.mentions.users.array()
            if(mentionsData.length > 0){
            
                const userTriggers = await getNumberOfTriggers(mentionsData[0].id)
                message.channel.send(`<@${mentionsData[0].id}> has been triggered ${userTriggers} times`)
            }
        }
    }
    catch(err){
        await message.channel.send(err.message || 'Unknown error')
    }
}

commands.returnAllTriggers = async function(message){
    try{
        if(message.content.replace(/[ ].*$/, '').toLowerCase() == returnTriggersCommand){
            const mentionsData = message.mentions.users.array()
            console.log(mentionsData.length)
            if(mentionsData.length == 0){
            
                const users = await Users.find({})
                console.log(users)
                
                let response = 'All triggered bots: \n'
                await asyncForEach(users, async user =>{
                    const userTriggers = await getNumberOfTriggers(user.user_id)
                    response = response + `> <@${user.user_id}> has been triggered ${userTriggers} \n`
                })
                await message.channel.send(response)
            }
        }
    }catch(err){
        await message.channel.send(err.message || 'Unknown error')
    }
}

commands.listAllCommands = async function(message){
    if(message.content.toLowerCase() == 'triggercommands' || message.content == 'triggerhelp'){
        const commands = `A list of all supported commands:
        > **trigger** *@user: triggers a user*
        > **triggerstats**: gets the triggered stats of all user*
        > **triggerstats** *@user: gets the triggered stats of a user*
        > **anime tidies**: oooohn
        > **gay**: No u!
        > **nigger synonyms**
        > **whamen synonyms**
        `
        await message.channel.send(commands)
    }
}
  
async function getNumberOfTriggers(user_id){
    try{
        const user = await Users.findOne({user_id})
        if(user) return user.triggers.length
        return 0
    }catch(err){
        console.log(err)
    }
}

module.exports = commands