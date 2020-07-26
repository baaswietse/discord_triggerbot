module.exports = {
    name: 'yikes',
    description: 'that\'s a yikes for me dawg',
    aliases: ['yikers'],
    anywhere: true,
    execute(message) {
        message.channel.send('that\'s also a yikes for me dawg')
    },
}