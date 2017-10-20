module.exports = (exitHandler) => {
	process.on('exit', exitHandler.bind(null, {cleanup:true}))
	process.on('SIGINT', exitHandler.bind(null, {exit:true}))
	process.on('SIGTERM', exitHandler.bind(null, {exit:true}))
	process.on('SIGUSR1', exitHandler.bind(null, {exit:true}))
	process.on('SIGUSR2', exitHandler.bind(null, {exit:true}))
	process.on('uncaughtException', exitHandler.bind(null, {exit:true}))
}
