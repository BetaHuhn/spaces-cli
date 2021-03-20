const Configstore = require('configstore')
const prompt = require('prompt-sync')({ sigint: false })
require('dotenv').config()

const url = require('url')
const path = require('path')

const packageJson = require('../package.json')
const config = new Configstore(packageJson.name, {})

const getEnv = (key) => {
	const envKey = key.toUpperCase()
	return process.env[envKey]
}

const toCamel = (s) => {
	return s.replace(/([-_][a-z])/ig, ($1) => {
		return $1.toUpperCase()
			.replace('-', '')
			.replace('_', '')
	})
}

const load = function(options, inputUrl) {

	const getValue = (key, defaultVal) => {
		const optionsKey = toCamel(key)
		if (options[optionsKey]) return options[optionsKey]

		const env = getEnv(key)
		if (env !== undefined) return env

		const stored = config.get(key)
		if (stored) return stored

		if (defaultVal !== undefined) return defaultVal

		throw new Error(`Option ${ key } not specified`)
	}

	const finalConfig = {
		accessKeyId: getValue('access_key_id'),
		secretAccessKey: getValue('secret_access_key'),
		access: getValue('access', 'private'),
		uploadTo: getValue('upload-to', '/'),
		configPath: config.path
	}

	if (inputUrl !== undefined) {
		const parsed = url.parse(inputUrl)
		finalConfig.fileKey = parsed.pathname.replace(/^\/+/, '')

		const output = options.output
		finalConfig.output = output ? output : path.basename(finalConfig.fileKey)

		const hostname = parsed.hostname

		if (hostname.includes('digitaloceanspaces.com')) {
			const space = hostname.includes('.cdn.digitaloceanspaces.com') ? hostname.replace('.cdn.digitaloceanspaces.com', '') : hostname.replace('.digitaloceanspaces.com', '')

			const values = space.split('.')
			finalConfig.space = values[0]
			finalConfig.region = values[1]
		}
	}

	if (finalConfig.space === undefined) {
		const space = getValue('space')

		if (space.includes('.')) {
			const values = space.split('.')
			finalConfig.space = values[0]
			finalConfig.region = values[1]
		} else {
			finalConfig.space = space
			finalConfig.region = getValue('region')
		}
	}

	finalConfig.domain = getValue('custom_domain', `${ finalConfig.space }.${ finalConfig.region }.digitaloceanspaces.com`)

	return finalConfig
}

const setup = function() {
	const accessKey = prompt('Access Key: ')
	config.set('access_key', accessKey)

	const domain = prompt('Custom Domain (optional): ')
	if (domain.length > 0) {
		config.set('domain', domain)
	} else {
		config.set('domain', `${ config.get('space') }.${ config.get('region') }.digitaloceanspaces.com`)
	}

	const permission = prompt('Default file permission, private or public (optional): ')
	if (permission === 'public') {
		config.set('permission', 'public')
	} else {
		config.set('permission', 'private')
	}

	const directory = prompt('Default upload directory (optional): ')
	if (directory.length > 0) {
		config.set('directory', directory)
	} else {
		config.set('directory', '/')
	}

	return config
}

module.exports = {
	load,
	setup
}