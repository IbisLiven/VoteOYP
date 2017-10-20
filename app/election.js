/**
The election object will have the following properties:
	timestamp: when the election was created, also used as its filename
	system: the election system used for that election (fptp,irvs,...)
	position: the position for which the election is being held
	candidates: an array of candiates in the election
		name: the candidate's name
		id: a unique id for the candidate
		position: the position that the candidate in compitition for
	status: when the election is in progress
	ballots: an array of all ballots cast in the election
		timestamp: the time the ballot was received
		vote: an array of candidate IDs in the order selected by the voter
	winner: the candidate who is the winner of the election
*/

const fs = require('fs')
const path = require('path')
const config = require(path.resolve('config/election'))

const create = (position, candidates, system, status) => {
	// set election properties
	let election = {
		timestamp: Date.now(),
		system: system || config.systems.unranked[0],
		position: position || config.positions[0],
		candidates: candidates || [],
		status: status ? true:false,
		ballots: [],
		winner: false
	}
	// create directory structure and election files
	createElectionsDir()
	linkElectionsFile(election.timestamp)
	// validate election properties
	election = setSystem(system, election)
	election = setPosition(position, election)
	election = setCandidates(candidates, election)
	// return election object
	return election
}
const start = (election=get()) => {
	election.status = true
	return setElection(election)
}
const stop = (election=get()) => {
	election.status = false
	election.winner = getResults(election)
	return setElection(election)
}
const setSystem = (system,election=get()) => {
	if (config.systems.ranked.includes(system) || config.systems.unranked.includes(system))
		election.system = system
	else
		election.system = config.systems.unranked[0]
	return setElection(election)
}
const setPosition = (position,election=get()) => {
	if(config.positions.includes(position)){
		election.position = position
		election.candidates = election.candidates.map(candidate=>{candidate.position=position;return candidate})
	}
	return setElection(election)
}
const setStatus = (status,election=get()) => {
	election.status = status?true:false
	return setElection(election)
}
const createCandidate = (name,position) => ({
	name,
	position,
	id: require(path.resolve('lib/hash')).hash(name),
})
const setCandidates = (candidates,election=get()) => {
	if(candidates) {
		if(typeof candidates[0] == 'string')
			candidates = candidates
				.map(candidate=>createCandidate(candidate,election.position))
		election.candidates = candidates
	}
	return setElection(election)
}
const addCandidate = (candidate,election=get()) => {
	if(typeof candidate == 'string')
		candidate = createCandidate(candidate,election.position)
	election.candidates.push(candidate)
	return setElection(election)
}
const removeCandidate = (candidate,election=get()) => {
	if(typeof candidate == 'string')
		candidate = election.candidates.filter(val=>val.name == candidate)[0]
	election.ballots = election.ballots.filter(val=>val.vote != candidate.id)
	election.candidates = election.candidates.filter(val=>val.id != candidate.id)
	return setElection(election)
}
const addBallot = (ballot,election=get()) => {
	election.ballots.push(ballot)
	return setElection(election)
}
const destroyBallots = (election=get()) => {
	election.ballots = []
	return setElection(election)
}
const getResults = (election=get()) =>
	require(path.resolve(`app/systems/${election.system.toLowerCase()}.js`))(election)

const getElection = (timestamp) =>
	readJSON(resolveFileName(timestamp))
const get = (timestamp='current') => getElection(timestamp)

const setElection = (election) => {
	return writeJSON(resolveFileName(election.timestamp),election)
}
const readJSON = (filepath) => {
	return JSON.parse(fs.readFileSync(filepath,'utf8'))
}
const writeJSON = (filepath,json) => {
	fs.writeFileSync(filepath,JSON.stringify(json),'utf8')
	return json
}
const resolveFileName = (timestamp='') => path.resolve(config['elections-dir'],String(timestamp))

const linkElectionsFile = (timestamp)=> {
	fs.unlink(resolveFileName('current'),()=>{
		fs.link(resolveFileName(timestamp),resolveFileName('current'),(err)=>{
			if(err)console.error(err)
		})
	})
}
const createElectionsDir = () => {
	if(!fs.existsSync(path.resolve(config['elections-dir'])))
		fs.mkdirSync(path.resolve(config['elections-dir']))
}

module.exports = {
	create,
	get,
	start,
	stop,
	setSystem,
	setPosition,
	setStatus,
	setCandidates,
	addCandidate,
	removeCandidate,
	addBallot,
	destroyBallots,
	getResults,
}
