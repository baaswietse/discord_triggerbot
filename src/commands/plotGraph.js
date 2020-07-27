const plotly = require('plotly')('baaswietse', 'eXHoyvKDUBOkKZenRCMU')
const fs = require('fs')
const Users = require('../models/Users')
const Discord = require('discord.js')

module.exports = {
    name: 'triggergraph',
    aliases: ['triggerplot', 'triggerplotter'],
    description: 'Graphical representation of all triggers',
    async execute(message, args) {
        let users = await Users.find({})
        let data = users.map((user) => {
            let plot = {
                x: [],
                y: [],
                type: 'scatter',
                name: user.triggers.length + ': ' + user.username,
                // mode: 'lines',
                line: {
                    width: 2
                }
            }
            user.triggers.forEach((element, i) => {
                plot.x.push(element.date)
                plot.y.push(i + 1)
            })
            plot.x.push(new Date())
            plot.y.push(user.triggers.length)
            return plot
        })
        data = data.sort((el1, el2) => el2.x.length - el1.x.length)

        var figure = {
            data
        }

        var imgOpts = {
            format: 'png',
            width: 800,
            height: 400
        }

        plotly.getImage(figure, imgOpts, function (error, imageStream) {
            if (error) return console.log(error)

            var fileStream = fs.createWriteStream('triggergraph.png')
            imageStream.pipe(fileStream).on('close', async () => {
                const embed = new Discord.MessageEmbed()
                    .attachFiles(['triggergraph.png'])
                    .setImage('attachment://triggergraph.png')
                    .setTitle('')

                await message.channel.send(embed)
                fs.unlinkSync('triggergraph.png')
            })

        })
    },
}