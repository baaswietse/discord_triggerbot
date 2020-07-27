const plotly = require('plotly')('baaswietse', 'eXHoyvKDUBOkKZenRCMU')
const fs = require('fs')
const Users = require('../models/Users')
const Discord = require('discord.js')

module.exports = {
    name: 'triggerpie',
    aliases: ['triggerpiechart'],
    description: 'Pie chart representation of all triggers',
    async execute(message, args) {
        let users = await Users.find({})
        var data = [{
            values: [],
            labels: [],
            type: 'pie'
        }]
        users.forEach(user => {
            data[0].values.push(user.triggers.length)
            data[0].labels.push(user.triggers.length + ': ' + user.username)
        })

        var figure = {
            data
        }

        var imgOpts = {
            format: 'png',
            width: 500,
            height: 400
        }

        plotly.getImage(figure, imgOpts, function (error, imageStream) {
            if (error) return console.log(error)

            var fileStream = fs.createWriteStream('triggerpie.png')
            imageStream.pipe(fileStream).on('close', async () => {
                const embed = new Discord.MessageEmbed()
                    .attachFiles(['triggerpie.png'])
                    .setImage('attachment://triggerpie.png')
                    .setTitle('')

                await message.channel.send(embed)
                fs.unlinkSync('triggerpie.png')
            })

        })
    },
}