module.exports = {
	name: 'prune',
	description: 'Prune up to 99 messages. Only available if TeamAlcool member.',
	args: true,
	aliases: ['delete'],
	execute(message, args) {
		const amount = parseInt(args[0]) + 1
		if (message.member.roles.cache.some(role => role.name === 'TeamAlcool' || role.name === 'Certified crew member')) {
			//Enkel voor TeamAlcool members
			if (isNaN(amount)) {
				return message.reply('that doesn\'t seem to be a valid number.')
			} else if (amount <= 1 || amount > 100) {
				return message.reply('you need to input a number between 1 and 99.')
			}

			message.channel.bulkDelete(amount, true).catch(err => {
				console.error(err)
				message.channel.send('there was an error trying to prune messages in this channel!')
			})
		} else {
			message.channel.send('you need to be in TeamAlcool to run this command')
		}
	},
}