// Server
const express = require('express')
const route = express.Router({mergeParams: true})

// filesystem
const path = require('path')

// election
const election = require(path.resolve('app/election'))
const ELECT = election.get

// security
const info = {
	username: require(path.resolve('config/server')).username || 'oyp_elections_admin',
	password: require(path.resolve('config/server')).passwords.ballot || String(parseInt(require(path.resolve('lib/hash')).pswd(5),16))
}

route.use(require('body-parser').urlencoded({ extended: false }))
route.use(require(path.resolve('lib/auth'))(info))

// routing
route.get('/',(req,res)=>{
	const ranked = require(path.resolve('config/election')).systems.ranked.includes(ELECT().system)
	if(ELECT().status)
		res.render(ranked?'rankedBallot':'ballot', {candidates:ELECT().candidates}, (err,html)=>{
			res.set({
				'Etag': require(path.resolve('lib/hash')).hash(html),
				'Cache-Control': 'public, no-cache'
			})
			res.send(html)
		})
	else
		res.send('no election in progress.')
})

route.post('/ballot',(req,res)=>{
	const wait = require(path.resolve('config/election')).ballot_wait_time
	if(ELECT().status) election.addBallot({vote:[].concat(req.body.vote), timestamp:Date.now()})
	// res.send(`<html><body><h1>your vote has been counted</h1><h2>please let the next person vote </h2><script>setTimeout(function(){window.location.href="/"},${wait})</script></body></html>`)
	res.send(`<h1>your vote has been counted.</h1><h2>please call the polling station attendant.</h2><form method="post" action="/next" ><input name="passcode" type="number" /><input type="submit" /></form>`)
})

route.post('/next',(req,res)=>{
	if(String(req.body.passcode) == info.password)
		res.send('<script>window.location.href="/"</script>')
	else
		res.send(`<h1>Incorrect Passcode.</h1><h2>please call the polling station attendant.</h2><form method="post" action="/next" ><input name="passcode" type="number" /><input type="submit" /></form>`)
},)

route.get('/test',(req,res)=>{
	const opts = {
		title: 'render test',
		message: 'hello, User!'
	}
	res.render('test',opts,(err,html)=>{
		res.send(html)
	})
})

route.get('/:invalid',(req,res,next)=>{
	res.status(404)
})

// misc
console.log('ballot username is:', info.username)
console.log('ballot password is:', info.password)

module.exports = route
