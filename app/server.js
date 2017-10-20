// Server
const express = require('express')
const app = express()

// filesystem
const path = require('path')

// View Engine
require(path.resolve('lib/viewEngine'))(app)
app.set('view engine','js')
app.set('views',path.resolve('views'))
app.set('view cache', true)

// Routes
app.get('/favicon.ico',(req,res)=>{
	res.sendFile(path.resolve('static/icon.png'))
})
app.use('/public', require(path.resolve('routes/static')))
app.use('/setup', require(path.resolve('routes/admin')))
app.use('/', require(path.resolve('routes/ballot')))

// Export
module.exports = app
