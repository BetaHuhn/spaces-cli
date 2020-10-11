require('dotenv').config()
const S3Interface = require('./Interface')
const ora = require('ora')
const url = require('url')
const fs = require('fs')
const path = require('path')
const loadConfig = require('./Config')

class Runner {
	constructor(args, options) {
		const config = loadConfig()
		this.config = config.all
		this.path = config.path
		this.options = options || {}
		this.args = args || []
	}

	_isDir(path) {
		return fs.lstatSync(path).isDirectory()
	}

	_makeS3Location(fileName, multiple, to, defaultPath) {
		if (multiple && to) {
			return (to.replace(/^\/+/, '').slice(-1) === '/' ? to.replace(/^\/+/, '') : to.replace(/^\/+/, '') + '/') + fileName
		} else if (!multiple && to) {
			const path = to.replace(/^\/+/, '')
			return path.substring(path.lastIndexOf('/') + 1).includes('.') ? path : (path.replace(/\/?$/, '/') + fileName)
		} else {
			return defaultPath.replace(/\/?$/, '/').replace(/^\/+/, '') + fileName
		}
	}

	_makeOutputPath(fileKey, output) {
		const getLastItem = (thePath) => thePath.substring(thePath.lastIndexOf('/') + 1)
		return output ? output : getLastItem(fileKey)
	}

	_makeFileKey(s3Url) {
		const parsed = url.parse(s3Url)
		return parsed.pathname.replace(/^\/+/, '')
	}

	async upload() {
		const { to, access, recursive } = this.options

		const args = this.args
		const permission = access || this.config.permission
		const defaultPath = this.config.directory
		const recursiveFolder = !(recursive === 'false' || recursive === undefined)

		try {
			const s3 = new S3Interface(this.config)

			if (this._isDir(args[0])) {
				const folder = args[0]

				const spinner = ora(`Uploading all files from dir ${ folder } to ${ to || '/' }`).start()

				const uploadFolder = async (currentFolder) => {

					const files = await fs.promises.readdir(currentFolder)

					files.forEach(async (file) => {
						const fullPath = path.join(currentFolder, file)

						const stat = await fs.promises.stat(fullPath)

						if (stat.isFile()) {
							const s3Path = this._makeS3Location(fullPath, false, to, defaultPath)

							spinner.text = `Uploading ${ fullPath } to ${ s3Path }`
							await s3.upload(fullPath, s3Path, permission)

						} else if (recursiveFolder) {
							uploadFolder(fullPath)
						} else {
							spinner.info(`skipping dir \'${ file }\', use -r true to include all subfolders`)
						}
					})
				}

				uploadFolder(folder)

				const location = 'https://' + this.config.domain + '/' + this._makeS3Location('', true, to)
				spinner.succeed(` All files uploaded to: ${ location }`)
			} else {
				args.forEach(async (file) => {
					const fileName = file
					const s3Path = this._makeS3Location(fileName, args.length > 1, to, defaultPath)

					const spinner = ora(`Uploading ${ fileName } to ${ s3Path }`).start()
					const result = await s3.upload(fileName, s3Path, permission)
					const location = this.config.domain !== undefined ? 'https://' + this.config.domain + result.Location.split('digitaloceanspaces.com')[1] : result.Location

					spinner.succeed(` Uploaded to: ${ location }`)

				})
			}

		} catch (err) {
			if (err.code === 'ENOENT') {
				return console.log('error: file/folder doesn\'t exist')
			}
			console.log(err)
		}
	}

	async download() {
		const { output } = this.options

		const fileKey = this._makeFileKey(this.args)
		const outputPath = this._makeOutputPath(fileKey, output)

		const spinner = ora(`Downloading from ${ fileKey }`).start()

		try {
			const s3 = new S3Interface(this.config)

			const result = await s3.download(fileKey, outputPath)

			spinner.succeed(` Downloaded to: ${ result }`)

		} catch (err) {
			console.log(err)
		}
	}

	outputConfig() {
		console.log(`Config stored at: ${ this.path }`)
		console.log(this.config)
	}
}

module.exports = Runner