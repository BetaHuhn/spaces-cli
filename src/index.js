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
	.description('upload file/s or directories to DO spaces')
	.option('-t, --to <path>', 'path to upload file to')
	.option('-a, --access <type>', 'permissions public/private')
	.option('-r, --recursive [type]', 'upload folder recursively')
	.action((args, program) => {
		const runner = new Runner(args, program)
		runner.upload()
	})

program
	.command('download <file>')
	.alias('down')
	.description('download file from DO spaces')
	.option('-o, --output <path>', 'path/file name of downloaded file')
	.action((args, program) => {
		const runner = new Runner(args, program)
		runner.download()
	})

program
	.command('config')
	.description('output current config')
	.action((args, program) => {
		const runner = new Runner(args, program)
		runner.outputConfig()
	})

program.on('command:*', (operands) => {
	console.error(`error: unknown command '${ operands[0] }'\n`)
	program.help()
	process.exitCode = 1
})

program.parse(process.argv)