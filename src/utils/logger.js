let logger = require('ololog')
logger = logger.configure({
	time: {
		yes: true,
		format: 'iso'
	},
	tag: true,
	stringify: {
		rightAlignKeys: false,
	}
})

module.exports = logger