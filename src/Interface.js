const AWS = require('aws-sdk')
const fs = require('fs')
const url = require('url')

class S3Interface {
	constructor(config) {
		this.config = config

		const spacesEndpoint = new AWS.Endpoint(`${ config.REGION }.digitaloceanspaces.com`)
		const s3 = new AWS.S3({
			endpoint: spacesEndpoint,
			accessKeyId: config.ACCESS_KEY,
			secretAccessKey: config.SECRET_KEY
		})

		this.s3 = s3
	}

	_getLocalFile(fileName) {
		const fileContent = fs.readFileSync(fileName)
		return fileContent
	}

	_outputPath(fileKey, output) {
		const getLastItem = (thePath) => thePath.substring(thePath.lastIndexOf('/') + 1)
		return output ? output : getLastItem(fileKey)
	}

	async upload(file, path, permission) {
		return new Promise((resolve, reject) => {
			const fileContent = this._getLocalFile(file)

			const options = {
				Body: fileContent,
				Bucket: this.config.SPACE,
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

	async download(s3Url, output) {
		return new Promise((resolve, reject) => {
			const parsed = url.parse(s3Url)
			const fileKey = parsed.pathname.replace(/^\/+/, '')

			const fileOutput = this._outputPath(fileKey, output)

			const options = {
				Bucket: this.config.SPACE,
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