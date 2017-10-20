function auth(req,res,next,realm){
	function unauthorized(res){
		res.set('WWW-Authenticate', `Basic realm=${realm.name}`)
		return res.sendStatus(401)
	}
	let user
	if(req.session)
		user = req.session.auth || require('basic-auth')(req)
	else
		user = require('basic-auth')(req)

	if (!user || !user.name || !user.pass)
		return unauthorized(res)
	if (user.name === realm.username && user.pass === realm.password) {
		try {req.session.auth = {pass:user.pass, name:user.name}}
		catch(e){}
		finally {
			return next()
		}
	}
	else
		return unauthorized(res)
}

module.exports = (realm) =>
	(req,res,next)=> auth(req,res,next,realm)
