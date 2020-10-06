require('dotenv').config()
const S3Interface = require('./Interface')
const ora = require('ora')

const config = {
	REGION: process.env.REGION || 'fra1',
	SPACE: process.env.SPACE || '',
	ACCESS_KEY: process.env.ACCESS_KEY || '',
	SECRET_KEY: process.env.SECRET_KEY || '',
	DOMAIN: process.env.DOMAIN
}

class Runner {
	constructor(options) {
		this.options = options || {}
	}

	async run() {
		const { upload, download, to, output, access } = this.options

		if (upload) {
			const fileName = upload
			const s3Path = to ? to.replace(/^\/+/, '') : fileName
			const permission = access || 'public'

			const spinner = ora(`Uploading ${ fileName } to ${ s3Path }`).start()

			try {
				const s3 = new S3Interface(config)

				const result = await s3.upload(fileName, s3Path, permission)
				const location = config.DOMAIN !== undefined ? 'https://' + config.DOMAIN + result.Location.split('digitaloceanspaces.com')[1] : result.Location

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