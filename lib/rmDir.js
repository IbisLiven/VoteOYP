module.exports = (dirPath, removeSelf=true) => {
	const fs = require('fs')
	try {var files = fs.readdirSync(dirPath)}
	catch(e) {return}
	if (files.length > 0)
		files.forEach(file=>{
			const filePath = dirPath + '/' + file
			if (fs.statSync(filePath).isFile())
				fs.unlinkSync(filePath)
			else
				rmDir(filePath)
		})
	if(removeSelf) fs.rmdirSync(dirPath)
}
