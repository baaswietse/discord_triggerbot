require('dotenv').config()
const fs = require('fs')
const Discord = require('discord.js')
const mongoose = require('mongoose')
let logger = require('./utils/logger')

mongoose.connect(process.env.DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
const connection = mongoose.connection
connection.once('open', function () {
	logger('MongoDB database connection established successfully')
})

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
const anywhereCommandFiles = fs.readdirSync('./src/commands/anywhere').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}
for (const file of anywhereCommandFiles) {
	const command = require(`./commands/anywhere/${file}`)
	client.commands.set(command.name, command)
}

const cooldowns = new Discord.Collection()

const {
	prefix
} = require('./config.json')

client.once('ready', () => {
	logger('Ready!')
})

client.on('message', message => {
	anywhere(message)

	if (!message.content.startsWith(prefix) || message.author.bot) return

	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const commandName = args.shift().toLowerCase()

	const command = client.commands.get(commandName) ||
		client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

	if (!command || command.anywhere) return

	logger.info.bright.blue('Got command:', command)

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!')
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
		}

		return message.channel.send(reply)
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection())
	}

	const now = Date.now()
	const timestamps = cooldowns.get(command.name)
	const cooldownAmount = (command.cooldown || 3) * 1000

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
		}
	}

	timestamps.set(message.author.id, now)
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

	try {
		command.execute(message, args)
	} catch (error) {
		logger.error(error)
		message.reply('there was an error trying to execute that command!')
	}
})

client.login(process.env.BOT_TOKEN)

const anywhere = (message) => {
	if (message.author.bot) return

	const args = message.content.trim().split(/ +/)
	for (let arg of args) {
		const command = client.commands.get(arg) ||
			client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(arg)) ||
			client.commands.find(cmd => { //aliases omzetten in regex en deze proberen toepassen
				if (cmd.aliases) {
					for (let element of cmd.aliases) {
						let reg = new RegExp(element)
						return reg.test(arg)
					}
				}
			})

		if (command && command.anywhere) {
			logger.info.blue('Got command:', command)
			command.execute(message, args)
			break
		}
	}
}