function post(uri,json={},callback){
	// console.log(uri,json)
	const xhr = new XMLHttpRequest()
	xhr.open("POST", uri, true)
	xhr.onload = ()=> {
		if(callback) callback(null,xhr.response)
	}
	xhr.onerror = ()=> {
		if(callback) callback(xhr.response)
	}
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
	xhr.send(JSON.stringify(json))
}
function destroyBallots(){
	post('/setup/destroy')
}
function resetElection(){
	post('/setup/new',{},(err,res)=>{
		if(err) console.error(err)
		else
			updateHighlights()
			renderCandidates()
			document.getElementById('winner').style.visibility = 'hidden'
	})
}
function openElection(){
	post('/setup/start',{},updateHighlights)
}
function closeElection(){
	post('/setup/close',{},(err,res)=>{
		if(err) console.error(err)
		else
			updateHighlights()
			displayWinner()
	})
}
function setSystem(system){
	post('/setup/setsystem',{system},updateHighlights)
}
function setPosition(position){
	post('/setup/setposition',{position},updateHighlights)
}
function addCandidate(){
	const add = document.getElementById('addCandidate')
	const plus = document.getElementById('plus')
	const input = document.getElementById('inputCandidateName')
	plus.style.display = 'none'
	input.style.display = 'inline'
	input.focus()
	input.select()
	add.setAttribute('onclick','')
	input.addEventListener('change',function _func(e){
		input.removeEventListener('change',_func)
		post('/setup/addcandidate',{candidate:e.target.value},(err,res)=>{
			if(err) console.error(err)
			else renderCandidates()
		})
		plus.style.display = 'inline'
		input.style.display = 'none'
		add.setAttribute('onclick','addCandidate()')
		input.value = ''
	})
}
function removeCandidate(candidate){
	post('/setup/removecandidate',{candidate})
	renderCandidates()
}

function displayWinner(){
	fetch('/setup/results',{
		credentials: "same-origin"
	})
	.then(res=>res.json())
	.then(results=>{
		const winner = document.getElementById('winner')
		winner.innerHTML =
			results.length == 1 ?
			`${results[0].name} has won ${results[0].position}` :
			`${results.map(winner=>winner.name).join(' and ')} have tied for ${results[0].position}`
		winner.style.visibility = 'visible'
	})
	updateHighlights()
}

function renderCandidates(){
	const container = document.getElementById('candidatesContainer')
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
	fetch('/setup/candidates',{
		credentials: "same-origin"
	})
	.then(res=>res.json())
	.then(candidates=>{
		candidates.forEach(candidate=>{
			const div = document.createElement('div')
			const span = document.createElement('span')
			span.innerHTML = candidate.name
			div.id = candidate.name
			div.className = 'button candidate'
			div.setAttribute('onclick',`removeCandidate('${candidate.name}')`)
			div.appendChild(span)
			container.appendChild(div)
		})
	})
	.catch(err=>{
		console.error(err)
	})
}
function updateHighlights(){
	fetch('/setup/info',{
		credentials: "same-origin"
	})
	.then(res=>res.json())
	.then(info=>{
		// console.log(info)
		unhighlightElements('status')
		unhighlightElements('systems')
		unhighlightElements('positions')
		highlightElement(info.status?'openElection':'closeElection')
		highlightElement(info.system)
		highlightElement(info.position)
	})
	.catch(err=>{
		console.error(err)
	})
	function highlightElement(id){
		higlightBgColor = 'lightgreen'
		document.getElementById(id).style['background-color'] = higlightBgColor
	}
	function unhighlightElements(parentID){
		defaultBgColor = 'lightsteelblue'
		const elements = document.getElementById(parentID).childNodes
		for(i=1;i<elements.length;i++)
			elements[i].style['background-color'] = defaultBgColor
	}
}

updateHighlights()
