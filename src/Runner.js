const fs = require('fs')
const path = require('path')

const S3Interface = require('./Interface')
const Config = require('./Config')
const Helpers = require('./Helpers')

class Runner {
	constructor(args, options) {
		this.options = options || {}
		this.args = args || []
		this.log = Helpers.logger(options.debug)
	}

	async upload() {
		try {
			this.log.load('Loading config')
			const config = await Config.load(this.options)
			const args = this.args

			this.log.debug(`Args: ${ args }`)

			this.log.changeText('Connecting to space')
			const s3 = new S3Interface(config)

			const isFile = fs.lstatSync(args[0]).isFile()
			this.log.debug(`is directory: ${ !isFile }`)

			if (isFile) {
				await Helpers.forEach(args, async (localPath) => {
					this.log.load()

					const filename = path.basename(localPath)
					const s3Path = Helpers.makeS3Path(config.uploadTo, filename, args.length > 1)

					this.log.changeText(`Uploading ${ filename } to ${ s3Path }`)
					const result = await s3.upload(localPath, s3Path, config.access)

					const outputPath = result.Location.split('digitaloceanspaces.com')[1]
					const location = `https://${ config.domain }${ outputPath }`
					this.log.succeed(`Uploaded to: ${ location }`)

				})

				return
			}

			const folder = args[0]
			const excludeParent = folder.endsWith('/')
			this.log.debug(`exclude parent folder: ${ excludeParent }`)

			this.log.changeText(`Uploading all files from dir ${ folder } to ${ config.uploadTo }`)

			const uploadFolder = async (currentFolder) => {

				const files = await fs.promises.readdir(currentFolder)

				this.log.debug(`Folder contains ${ files.length } file(s)`)

				await Helpers.forEach(files, async (file) => {
					const localPath = path.join(currentFolder, file)
					const stat = await fs.promises.stat(localPath)

					if (stat.isFile()) {
						this.log.debug(`Creating upload path for ${ localPath }`)

						const adjustedLocalPath = excludeParent ? localPath.replace(folder, '') : localPath
						const s3Path = Helpers.makeS3Path(config.uploadTo, adjustedLocalPath, true)

						this.log.changeText(`Uploading ${ localPath } to ${ s3Path }`)
						await s3.upload(localPath, s3Path, config.access)

					} else {
						this.log.debug(`${ localPath } is a folder; recursive upload`)
						await uploadFolder(localPath)
					}
				})
			}

			await uploadFolder(folder)

			const outputPath = excludeParent ? config.uploadTo : path.join(config.uploadTo, folder)
			const location = `https://${ config.domain }/${ Helpers.removeLeadingSlash(outputPath) }`

			this.log.succeed(`All files uploaded to: ${ location }`)

		} catch (err) {
			if (err.code === 'ENOENT') {
				return this.log.fail('file/folder doesn\'t exist')
			}

			this.log.fail(err.message)
			this.log.debug(err)
		}
	}

	async download() {
		try {
			const args = this.args
			this.log.debug(`Args: ${ args }`)

			this.log.load('Loading config')
			const config = await Config.load(this.options, args)

			this.log.changeText('Connecting to space')
			const s3 = new S3Interface(config)

			this.log.changeText(`Downloading file ${ config.fileKey }`)
			const result = await s3.download(config.fileKey, config.output)

			this.log.succeed(`Downloaded to: ${ result }`)

		} catch (err) {
			this.log.fail(err.message)
			this.log.debug(err)
		}
	}

	setup() {
		console.log(`Starting setup...`)
		const config = Config.setup()

		console.log(`Config stored at: ${ config.path }`)
		console.log(config.all)
	}

	outputConfig() {
		this.log.load('Loading config')
		const config = Config.load(this.options)

		this.log.info(`Config stored at: ${ config.configPath }`)
		this.log.text(config)
	}
}

module.exports = Runner