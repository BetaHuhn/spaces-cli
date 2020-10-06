const Configstore = require('configstore')
const prompt = require('prompt-sync')()
const packageJson = require('../package.json')

const config = new Configstore(packageJson.name, { sigint: true })

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
		config.set('domain', domain)
	}

	if (!config.get('permission')) {
		const permission = prompt('Default file permission (private/public): ')
		if (permission === 'public') {
			config.set('permission', 'public')
		} else {
			config.set('permission', 'private')
		}
	}

	return config.all
}

module.exports = loadConfig