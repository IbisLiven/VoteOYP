module.exports = (app)=>{
	const view = require('./view')
	app.engine('js',(filepath,options,callback)=>{
		const rendered = view.render(require(filepath)(view.element,options))
		return callback(null,rendered)
	})
}
