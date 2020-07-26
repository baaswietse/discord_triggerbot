module.exports = {
    name: 'move-up',
    aliases: ['push-up', 'moveup', 'pushup'],
    description: 'Moves all messages up.',
    execute(message, args) {
        let moveup = 'Got you fam\n'
        for (i = 0; i < 40; i++) {
            moveup += ':eyes:\n'
        }
        message.channel.send(moveup)
    },
}