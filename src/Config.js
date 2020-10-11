const Configstore = require('configstore')
const prompt = require('prompt-sync')({ sigint: false })
const packageJson = require('../package.json')

const config = new Configstore(packageJson.name, {})

const loadConfig = function() {
	if (!config.get('access_key')) {
		const accessKey = prompt('Access Key: ')
		config.set('access_key', accessKey)
	}

	if (!config.get('secret_key')) {
		const secretKey = prompt('Secret Key: ')
		config.set('secret_key', secretKey)
	}

	if (!config.get('region')) {
		const region = prompt('Space Region: ')
		config.set('region', region)
	}

	if (!config.get('space')) {
		const space = prompt('Space Name: ')
		config.set('space', space)
	}

	if (!config.get('domain')) {
		const domain = prompt('Custom Domain (optional): ')
		if (domain.length > 0) {
			config.set('domain', domain)
		} else {
			config.set('domain', `${ config.get('space') }.${ config.get('region') }.digitaloceanspaces.com`)
		}
	}

	if (!config.get('permission')) {
		const permission = prompt('Default file permission (private/public): ')
		if (permission === 'public') {
			config.set('permission', 'public')
		} else {
			config.set('permission', 'private')
		}
	}

	if (!config.get('directory')) {
		const directory = prompt('Default upload directory (optional): ')
		if (directory.length > 0) {
			config.set('directory', directory)
		} else {
			config.set('directory', '/')
		}
	}

	return config
}

module.exports = loadConfig