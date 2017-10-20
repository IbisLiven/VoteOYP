// Server
const express = require('express')
const route = express.Router({mergeParams: true})
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

// filesystem
const path = require('path')

// election
const election = require(path.resolve('app/election'))
let ELECTID = election.create().timestamp
const ELECT = (timestamp=ELECTID) => election.get(timestamp)
const ELECTIONS = []
ELECTIONS.push(ELECTID)

// security
const info = {
	username: require(path.resolve('config/server')).username || 'oyp_elections_admin',
	password: require(path.resolve('config/server')).passwords.admin || require(path.resolve('lib/hash')).pswd(10)
}
route.use(require('body-parser').json())
route.use(session({store: new MemoryStore({checkPeriod: 86400000}),secret:'max',saveUninitialized:'false',resave:'false'}))
route.use(require(path.resolve('lib/auth'))(info))

// routing
route.get('/',(req,res)=>{
	const config = require(path.resolve('config/election'))
	const opts = {
		css: '/public/setup.css',
		js: '/public/setup.js',
		systems: [...config.systems.ranked,...config.systems.unranked],
		positions: config.positions,
		candidates: ELECT().candidates,
	}
	res.render('admin',opts, (err,html)=>{
		res.set({
			'Etag': require(path.resolve('lib/hash')).hash(html),
			'Cache-Control': 'public, no-cache'
		})
		res.send(html)
	})
})

route.get('/results',(req,res)=>{
	res.send(election.getResults(ELECT()))
})
route.get('/info',(req,res)=>{
	res.json({
		system: ELECT().system,
		position: ELECT().position,
		candidates: ELECT().candidates,
		status: ELECT().status,
	})
})
route.get('/system',(req,res)=>{
	res.json(ELECT().system)
})
route.get('/position',(req,res)=>{
	res.json(ELECT().position)
})
route.get('/status',(req,res)=>{
	res.json(ELECT().status)
})
route.get('/candidates',(req,res)=>{
	res.json(ELECT().candidates)
})
route.get('/ballots',(req,res)=>{
	res.json(ELECT().ballots)
})
route.post('/setsystem',(req,res)=>{
	res.json(election.setSystem(req.body.system,ELECT()))
})
route.post('/setposition',(req,res)=>{
	res.json(election.setPosition(req.body.position,ELECT()))
})
route.post('/addcandidate',(req,res)=>{
	res.json(election.addCandidate(req.body.candidate,ELECT()))
})
route.post('/removecandidate',(req,res)=>{
	res.json(election.removeCandidate(req.body.candidate,ELECT()))
})
route.post('/start',(req,res)=>{
	election.start(ELECT())
	res.send('election opened')
})
route.post('/close',(req,res)=>{
	let winner = election.stop(ELECT()).winner
	res.send(`election closed. ${Array.isArray(winner)?winner.join(' and '):winner} won`)
})
route.post('/destroy',(req,res)=>{
	res.send(ELECTIONS.map(timestamp=>election.destroyBallots(ELECT(timestamp))))
})
route.post('/new',(req,res)=>{
	ELECTID = election.create().timestamp
	ELECTIONS.push(ELECTID)
	res.send('new election created')
})


route.get('/test',(req,res)=>{
	const opts = {
		title: 'render test',
		message: 'hello, Admin!'
	}
	res.render('test',opts,(err,html)=>{
		res.send(html)
	})
})

route.get('/:invalid',(req,res,next)=>{
	res.status(404)
})
route.post('/:invalid',(req,res,next)=>{
	res.status(404)
})

// Testing election
/*election.setCandidates(['Jane','Paul','Alice'],ELECT())
election.setStatus(true,ELECT())*/

// misc
console.log('admin username is:', info.username)
console.log('admin password is:', info.password)

module.exports = route
