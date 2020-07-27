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
                name: user.username,
                // mode: 'lines',
                line: {
                    width: 2
                }
            }
            user.triggers.forEach((element, i) => {
                plot.x.push(element.date)
                plot.y.push(i + 1)
            })
            return plot
        })

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
            imageStream.pipe(fileStream).on('close', () => {
                const embed = new Discord.MessageEmbed()
                    .attachFiles(['triggergraph.png'])
                    .setImage('attachment://triggergraph.png')
                    .setTitle('')

                message.channel.send(embed)
            })

        })
    },
}