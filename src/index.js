#!/usr/bin/env node

const program = require('commander')
const packageJson = require('../package.json')
const Runner = require('../src/Runner')

program
	.version(packageJson.version, '-v, --version')
	.description('Quickly upload and download files from DigitalOcean Spaces.')

program
	.command('upload <files...>')
	.alias('up')
	.description('Upload file/s or directories to DO spaces')
	.option('-t, --upload-to <path>', 'path to upload file to')
	.option('-s, --space <name>', 'specify the name of your DO space')
	.option('-r, --region <name>', 'specify the region of your space')
	.option('-a, --access <permission>', 'file permission public/private (default: private)')
	.option('-i, --access-key-id <key>', 'space access key id')
	.option('-k, --secret-access-key <key>', 'space secret key')
	.option('-c, --custom-domain <name>', 'specify custom CDN endpoint')
	.option('-d, --debug', 'enable debug mode', false)
	.action((args, options) => {
		const runner = new Runner(args, options)
		runner.upload()
	})

program
	.command('download <file>')
	.alias('down')
	.description('Download file from DO spaces')
	.option('-o, --output <path>', 'path/file name of downloaded file')
	.option('-s, --space <name>', 'specify the name of your DO space')
	.option('-r, --region <name>', 'specify the region of your space')
	.option('-a, --access <permission>', 'file permission public/private')
	.option('-i, --access-key-id <key>', 'space access key id')
	.option('-k, --secret-access-key <key>', 'space secret key')
	.option('-c, --custom-domain <name>', 'specify custom CDN endpoint')
	.option('-d, --debug', 'enable debug mode', false)
	.action((args, options) => {
		const runner = new Runner(args, options)
		runner.download()
	})

program
	.command('config')
	.description('Output current config')
	.option('-d, --debug', 'enable debug mode', false)
	.action((options) => {
		const runner = new Runner({}, options)
		runner.outputConfig()
	})

program
	.command('setup')
	.description('Start interactive setup')
	.option('-d, --debug', 'enable debug mode', false)
	.action((args, options) => {
		const runner = new Runner(args, options)
		runner.setup()
	})

program.on('command:*', (operands) => {
	console.error(`error: unknown command '${ operands[0] }'\n`)
	program.help()
	process.exitCode = 1
})

program.parse(process.argv)