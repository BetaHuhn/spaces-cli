const AWS = require('aws-sdk')
const fs = require('fs')

class S3Interface {
	constructor(config) {
		this.config = config

		const spacesEndpoint = new AWS.Endpoint(`${ config.region }.digitaloceanspaces.com`)
		const s3 = new AWS.S3({
			endpoint: spacesEndpoint,
			accessKeyId: config.access_key,
			secretAccessKey: config.secret_key
		})

		this.s3 = s3
	}

	_getLocalFile(fileName) {
		const fileContent = fs.readFileSync(fileName)
		return fileContent
	}

	async upload(file, path, permission) {
		return new Promise((resolve, reject) => {
			const fileContent = this._getLocalFile(file)

			const options = {
				Body: fileContent,
				Bucket: this.config.space,
				Key: path,
				ACL: permission === 'public' ? 'public-read' : undefined
			}

			this.s3.upload(options, (err, data) => {
				if (err) {
					return reject(err)
				}

				resolve(data)
			})
		})
	}

	async download(fileKey, fileOutput) {
		return new Promise((resolve, reject) => {

			const options = {
				Bucket: this.config.space,
				Key: fileKey
			}

			const readStream = this.s3.getObject(options).createReadStream()
			const writeStream = fs.createWriteStream(fileOutput)
			readStream.pipe(writeStream)

			writeStream.on('error', (err) => {
				reject(err)
			})

			writeStream.on('close', () => {
				resolve(fileOutput)
			})
		})
	}
}

module.exports = S3Interface