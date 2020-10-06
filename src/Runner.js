require('dotenv').config()
const S3Interface = require('./Interface')
const ora = require('ora')
const loadConfig = require('./Config')

class Runner {
	constructor(options) {
		this.options = options || {}
	}

	async run() {

		const config = loadConfig()

		const { upload, download, to, output, access } = this.options

		if (upload) {
			const fileName = upload
			const s3Path = to ? to.replace(/^\/+/, '') : fileName
			const permission = access || config.permission

			const spinner = ora(`Uploading ${ fileName } to ${ s3Path }`).start()

			try {
				const s3 = new S3Interface(config)

				const result = await s3.upload(fileName, s3Path, permission)
				const location = config.domain !== undefined ? 'https://' + config.domain + result.Location.split('digitaloceanspaces.com')[1] : result.Location

				spinner.succeed(` Uploaded to: ${ location }`)

			} catch (err) {
				console.log(err)
			}

		} else if (download) {
			const fileUrl = download

			const spinner = ora(`Downloading from ${ fileUrl }`).start()

			try {
				const s3 = new S3Interface(config)

				const result = await s3.download(fileUrl, output)

				spinner.succeed(` Downloaded to: ${ result }`)

			} catch (err) {
				console.log(err)
			}
		}
	}
}

module.exports = Runner