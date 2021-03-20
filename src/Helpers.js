const ora = require('ora')
const path = require('path')

const removeLeadingSlash = (text) => {
	return text.replace(/^\/+/, '')
}

const makeS3Path = (uploadPath, localPath, multiple) => {
	const basename = path.basename(uploadPath)

	// If the basname has an extension assume it's a file
	const re = /(?:\.([^.]+))?$/
	const isFile = re.exec(basename)[1] !== undefined

	// If uploading multiple files and uploadPath is a file, throw error
	if (isFile && multiple) throw new Error(`Invalid upload path for multiple files (path can't end with file extension)`)

	// If uploadPath is a file, use it as fileKey, else combine it with localPath
	const output = isFile ? uploadPath : path.join(uploadPath, localPath)
	return removeLeadingSlash(output)
}

const forEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		// eslint-disable-next-line callback-return
		await callback(array[index], index, array)
	}
}

const logger = (debugMode) => {
	const spinner = ora()

	const load = (text) => {
		if (text) spinner.text = text
		spinner.start()
	}

	const info = (text) => {
		spinner.info(text)
	}

	const warn = (text) => {
		spinner.warn(text)
	}

	const succeed = (text) => {
		spinner.succeed(` ${ text }`)
	}

	const fail = (text) => {
		spinner.fail(` ${ text }`)
	}

	const clear = () => {
		spinner.clear()
	}

	const text = (text) => {
		spinner.stop()
		console.log(text)
	}

	const stop = (text) => {
		if (text) {
			spinner.text = text
			spinner.stopAndPersist()
			return
		}

		spinner.stop()
	}

	const debug = (text) => {
		if (debugMode) {
			spinner.clear()
			console.log(text)
			spinner.render()
		}
	}

	const changeText = (text) => {
		spinner.text = text
		debug(text)
	}

	return {
		load,
		changeText,
		text,
		info,
		warn,
		fail,
		debug,
		clear,
		succeed,
		stop
	}
}

module.exports = {
	removeLeadingSlash,
	makeS3Path,
	forEach,
	logger
}