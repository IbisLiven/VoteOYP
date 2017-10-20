module.exports = (element, opts)=>{
	const html = element('html')
	const head = html.add(element('head'))
	head.add(element('title').add(opts.title))
	const body = html.add(element('body'))
	body.add(element('h1').add('testing... 1. 2. 3.'))
	body.add(element('p').add(opts.message))
	return html
}
