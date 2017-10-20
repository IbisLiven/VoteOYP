function generateHash(seed){
	return require('crypto')
		.createHash('md5')
		.update(seed||'false')
		.digest('base64')
}

function generatePassword(length=10,type='hex'){
	return require('crypto')
		.createHash('md5')
		.update(('pswd'+Math.random()).substring(0,8))
		.digest(type)
		.substring(0,length)
}

module.exports = {
	hash: generateHash,
	pswd: generatePassword
}
