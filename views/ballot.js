module.exports = (element, opts) => {
	if(typeof opts.candidates === null) return 'There are no candidates yet.'
	if(typeof opts.instruction == 'undefined') opts.instruction = 'Select One'
	let html = element('html')
	let head = html.add(element('head'))
	let body = html.add(element('body'))
	head.add(element('meta','charset="utf-8"'))
	head.add(element('title').add('Vote Here'))
	head.add(element('link',['rel="stylesheet"','type="text/css"','href="/public/ballot.css"']))
	body.add(element('h1').add('Vote Here'))
	body.add(element('h2').add(opts.instruction))
	let form = body.add(element('form',['method="post"','action="ballot"']))
	opts.candidates.forEach(candidate=>{
		const button = form.add(element('label',['class="button"']))
		button.add(element('input',['type="radio"','name="vote"',`value="${candidate.id}"`]))
		button.add(element('span').add(candidate.name))
	})
	form.add(element('input',['id="submit"','type="submit"']))
	return html
}
