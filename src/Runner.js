require('dotenv').config()
const S3Interface = require('./Interface')
const ora = require('ora')
const loadConfig = require('./Config')

class Runner {
	constructor(args, options) {
		this.options = options || {}
		this.args = args || []
		this.config = loadConfig()
	}

	_makeS3Location(fileName, multiple, to) {
		if (multiple && to) {
			return (to.replace(/^\/+/, '').slice(-1) === '/' ? to.replace(/^\/+/, '') : to.replace(/^\/+/, '') + '/') + fileName
		} else if (!multiple && to) {
			const path = to.replace(/^\/+/, '')
			return path.substring(path.lastIndexOf('/') + 1).includes('.') ? path : (path.replace(/\/?$/, '/') + fileName)
		} else {
			return fileName
		}
	}

	async upload() {
		const { to, access } = this.options

		const args = this.args
		const permission = access || this.config.permission

		try {
			const s3 = new S3Interface(this.config)

			args.forEach(async (file) => {
				const fileName = file
				const s3Path = this._makeS3Location(fileName, args.length > 1, to)

				const spinner = ora(`Uploading ${ fileName } to ${ s3Path }`).start()
				const result = await s3.upload(fileName, s3Path, permission)
				const location = this.config.domain !== undefined ? 'https://' + this.config.domain + result.Location.split('digitaloceanspaces.com')[1] : result.Location

				spinner.succeed(` Uploaded to: ${ location }`)

			})

		} catch (err) {
			console.log(err)
		}
	}

	async download() {
		const { output } = this.options

		const fileUrl = this.args

		const spinner = ora(`Downloading from ${ fileUrl }`).start()

		try {
			const s3 = new S3Interface(this.config)

			const result = await s3.download(fileUrl, output)

			spinner.succeed(` Downloaded to: ${ result }`)

		} catch (err) {
			console.log(err)
		}
	}

	outputConfig() {
		console.log(this.config)
	}
}

module.exports = Runner