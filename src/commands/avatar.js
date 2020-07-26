const Discord = require('discord.js')

module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	aliases: ['icon', 'pfp'],
	execute(message) {
		// Wanner geen metions => avatar van author
		if (!message.mentions.users.size) {
			return message.channel.send('your avatar:', {
				files: [message.author.displayAvatarURL({
					dynamic: true
				})]
			})
		}

		// wanneer wel mentions => avatar van de eerste mention
		message.channel.send(`${message.mentions.users.first().username}'s avatar:`, {
			files: [message.mentions.users.first().displayAvatarURL({
				dynamic: true
			})]
		})
	},
}