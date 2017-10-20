module.exports = (element, opts)=>{
	const html = element('html','lang="en"')
	const head = html.add(element('head'))
		head.add(element('title').add('VoteOYP Setup'))
		head.add(element('meta','charset="utf-8"'))
		head.add(element('link',['rel="stylesheet"',`href="${opts.css}"`]))
	const body = html.add(element('body'))
		body.add(element('h1').add('OYP Election Setup'))
			const main = body.add(element('main'))
				main.add(element('h1',['id="winner"','style="visibility:hidden;"']))
				const reset = main.add(element('div',['class="button"','onclick="resetElection()"']))
					reset.add(element('h2').add('Reset Election'))
				const destroy = main.add(element('div',['class="button"','onclick="destroyBallots()"']))
					destroy.add(element('h2').add('Destroy All Ballots'))
				const status = main.add(element('div','id="status"'))
					status.add(element('h2').add('Open/Close Election'))
					const open = status.add(element('div',['id="openElection"','class="button"','onclick="openElection()"']))
						open.add(element('span').add('Open'))
					const close = status.add(element('div',['id="closeElection"','class="button"','onclick="closeElection()"']))
						close.add(element('span').add('Close'))
				const systems = main.add(element('div','id="systems"'))
					systems.add(element('h2').add('Set Election Type'))
					opts.systems.forEach(system=>{
						const sys = systems.add(element('div',
						[`id="${system}"`,'class="button system"',`onclick="setSystem('${system}')"`]))
							sys.add(element('span').add(system))
					})
				const positions = main.add(element('div','id="positions"'))
					positions.add(element('h2').add('Set Election Position'))
					opts.positions.forEach(position=>{
						const pos = positions.add(element('div',
						[`id="${position}"`,'class="button postition"',`onclick="setPosition('${position}')"`]))
							pos.add(element('span').add(position))
					})
				const candidates = main.add(element('div','id="candidates"'))
					candidates.add(element('h2').add('Candidates'))
					const container = candidates.add(element('div','id=candidatesContainer'))
					opts.candidates.forEach(candidate=>{
						const can = container.add(element('div',
						[`id="${candidate.name}"`,'class="button candidate"',`onclick="removeCandidate('${candidate.name}')"`]))
							can.add(element('span').add(candidate.name))
					})
					const addCandidate = candidates.add(element('div',['id="addCandidate"','class="button"','onclick="addCandidate()"']))
						addCandidate.add(element('span','id="plus"').add('+'))
						addCandidate.add(element('input',['id="inputCandidateName"','type="text"','style="display:none;"']))
			body.add(element('script',`src="${opts.js}"`))
	return html
}
