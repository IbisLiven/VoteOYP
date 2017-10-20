const path = require('path')
const electionsDir = path.resolve(require(path.resolve('config/election'))['elections-dir'])
const rmDir = require(path.resolve('lib/rmDir'))
const exitHandler = (options, err) => {
	if (options.cleanup) rmDir(electionsDir)
	if (err) console.log(err.stack)
	if (options.exit) process.exit()
}

require(path.resolve('lib/exit'))(exitHandler)
