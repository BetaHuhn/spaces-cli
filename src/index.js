#!/usr/bin/env node

const program = require('commander')
const packageJson = require('../package.json')
const Runner = require('../src/Runner')

program
	.version(packageJson.version, '-v, --version')
	.option('-u, --upload <file>', 'uploads file to DO spaces')
	.option('-t, --to <path>', 'path to upload file to')
	.option('-d, --download <fileUrl>', 'download file from DO spaces')
	.option('-o, --output <path>', 'path/file name of downloaded file')
	.option('-a, --access <type>', 'permissions public/private')

program.parse(process.argv);

(async () => {
	const runner = new Runner(program)
	await runner.run()
})()