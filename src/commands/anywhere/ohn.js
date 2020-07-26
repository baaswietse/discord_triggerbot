module.exports = {
    name: 'ohn',
    description: 'oooohn',
    aliases: [/o+hn/i],
    anywhere: true,
    execute(message) {
        message.channel.send('ooohn')
    },
}