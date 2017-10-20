module.exports = (app,config) => {
	const ipaddr = require('ip').address()
	const port = config.port || process.env.PORT
	const hostname = config.host || ipaddr
	app.set('port', port)

	// HTTP1 INSECURE
	app.listen(port, hostname, ()=>{
		console.log(`server is running on ${ipaddr}:${port}`)
	})
	// HTTP1 SECURE
	/*const fs = require('fs')
	const opts = {
		key: fs.readFileSync('key.pem'),
		cert: fs.readFileSync('cert.pem'),
	}
	const server = require('https').createServer(opts, app).listen(port,hostname,(err)=>{
		if (err) {
			console.error(err)
			return process.exit(1)
		}
		console.log('listening on port',port)
	})*/
}
