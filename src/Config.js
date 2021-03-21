const Configstore = require('configstore')
const prompt = require('prompt-sync')({ sigint: true })
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

	// Get the value for the given key; order: command line args, env variable, stored value, default value or error
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

	// On the download command parse the fileKey, space name and region from the given file url
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

	// If space wasn't found in file url or upload command was used, get it manually
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

	// Since default requires space and region, get custom_domain after all other options
	finalConfig.custom_domain = getValue('custom_domain', `${ finalConfig.space }.${ finalConfig.region }.digitaloceanspaces.com`)

	return finalConfig
}

const setup = function(log) {
	const getAndStoreInput = (params) => {
		const { key, text, required, dft, allowed } = params

		const inputText = `${ text } (${ required ? 'required' : 'optional' }): `
		const input = prompt(inputText)

		if (input) {
			if (allowed && !allowed.includes(input)) {
				log.warn(`Invalid input; Allowed values are ${ allowed.join('/') }`)
				return getAndStoreInput(params)
			}

			return config.set(key, input)
		}

		if (required) return getAndStoreInput(params)

		config.set(key, dft)
	}

	const options = [
		{
			key: 'access_key_id',
			text: 'Access Key ID',
			required: true
		},
		{
			key: 'secret_access_key',
			text: 'Secret Access Key',
			required: true
		},
		{
			key: 'space',
			text: 'Name of your Space',
			required: true
		},
		{
			key: 'region',
			text: 'Region of your Space',
			required: true
		},
		{
			key: 'access',
			text: 'Default file permissions, either private or public',
			required: false,
			dft: 'public',
			allowed: [ 'public', 'private' ]
		},
		{
			key: 'custom_domain',
			text: 'Custom Domain/CDN endpoint',
			required: false
		},
		{
			key: 'upload_to',
			text: 'Default upload directory',
			required: false,
			dft: '/'
		}
	]

	console.log()

	// If config already exists, confirm overwrite
	if (Object.keys(config.all).length !== 0) {
		log.warn(`Existing config found`)
		const res = prompt(`Continue and overwrite it? (y/n): `)
		if (res !== 'y' & res !== 'yes') {
			log.fail(`Canceling setup`)
			process.exit(0)
		}
	}

	// Go through all config options and ask user for input
	options.forEach((item) => {
		getAndStoreInput(item)
	})

	// Manually set default custom_domain
	if (!config.custom_domain) {
		config.set('custom_domain', `${ config.get('space') }.${ config.get('region') }.digitaloceanspaces.com`)
	}

	console.log()

	return config
}

const getConfigPath = () => {
	return config.path
}

module.exports = {
	load,
	setup,
	getConfigPath
}