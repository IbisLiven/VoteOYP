function render(arg){
	const unpackAttributes = (attributes)=>{
		if(Array.isArray(attributes))
			return ` ${attributes.join(' ')} `
		else if(typeof attributes === 'string')
			return ` ${attributes} `
		else
			return ''
	}
	const handleContents = (contents)=>{
		if(typeof contents === 'string')
			return contents
		else
			return contents
				.map(element=>{
					if(typeof element === 'string')
						return element
					else
						return render(element)
				})
				.join('')
	}
	switch(arg.type){
		case 'area':
		case 'base':
		case 'br':
		case 'col':
		case 'command':
		case 'embed':
		case 'hr':
		case 'img':
		case 'input':
		case 'keygen':
		case 'link':
		case 'meta':
		case 'param':
		case 'source':
		case 'track':
		case 'wbr':
			return `<${arg.type} ${unpackAttributes(arg.attributes).trim()} />`
		default:
			return `<${arg.type}${unpackAttributes(arg.attributes)}>${handleContents(arg.contents)}</${arg.type}>`
	}
}
function element(type,attributes){
	return {
		'type':type,
		'attributes':attributes,
		'contents':[],
		add:function(arg){
			this.contents.push(arg)
			if(typeof arg === 'object')
				return arg
			else
				return this
		}
	}
}

module.exports = {
	element,
	render
}
