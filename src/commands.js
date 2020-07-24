const Users = require('./models/Users')
const asyncForEach = require('async-await-foreach') 

const addTriggerCommand = '#trigger'
const returnTriggersCommand = '#triggerstats'

const commands = {}

commands.addTrigger = async function (message){
    if(message.content.substring(0, message.content.indexOf(' ')) == addTriggerCommand){
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

        try{
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
        }catch(err){
            console.log(err)
        }

        // No @ mentions
        }else{
        await message.channel.send('no "@" mention')
        }
    }   
}
  
commands.returnTriggers = async function(message){
    if(message.content.substring(0, message.content.indexOf(' ')) == returnTriggersCommand){
        const mentionsData = message.mentions.users.array()
        if(mentionsData.length > 0){
        const userTriggers = await getNumberOfTriggers(mentionsData[0].id)
        message.channel.send(`<@${mentionsData[0].id}> has been triggered ${userTriggers} times`)

        // No @ mentions
        }else{
        await message.channel.send('no "@" mention')
        }
    }
}
  
commands.listAllCommands = async function(message){
    if(message.content == '#triggercommands'){
        const commands = `A list of all supported commands:
        > **#trigger** *@user: triggers a user*
        > **#triggerstats** *@user: gets the triggered stats of a user*
        `
        await message.channel.send(commands)
    }
}
  
/*commands.unknownCommands = async function(message){
    if(message.content.startsWith('#trigger')){
        const commands = `A list of all supported commands:
        > **#trigger** *@user: triggers a user*
        > **#triggerstats** *@user: gets the triggered stats of a user*
        `
        await message.channel.send(commands)
    }
}*/
  
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