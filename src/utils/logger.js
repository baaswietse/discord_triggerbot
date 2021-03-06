let logger = require('ololog')
logger = logger.configure({
	time: {
		yes: true,
		locale: 'nl-be',
		options: {
			timeZone: 'Europe/Brussels'
		}
	},
	tag: true,
	stringify: {
		rightAlignKeys: false,
	}
})

module.exports = logger