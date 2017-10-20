module.exports = (election) => election.candidates
	.map(candidate=>Object.assign(candidate,
		// Tally Votes
		{
			votes: election.ballots
				.filter(ballot=>ballot.vote[0] == candidate.id).length
		}
	))
	.reduce((winners,candidate)=>{
		// Determine Winner
		if(candidate.votes <  winners[0].votes) return winners
		if(candidate.votes == winners[0].votes) return winners.concat(candidate)
		if(candidate.votes >  winners[0].votes) return [].concat(candidate)
	},[{votes:-1}])
