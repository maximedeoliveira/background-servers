import execCommand from './execCommand'
import ping from '../utils/ping'
import debug from '../utils/debug'
import * as core from '@actions/core'

const isUrl = (s: string) => /^http[s]?:\/\//.test(s)

async function waitOnUrl(url: string, waitOnTimeout = 60): Promise<void> {
	debug(`wait: waiting on "${url}" with timeout of ${waitOnTimeout} seconds`)

	const waitTimeoutMs = waitOnTimeout * 1000

	const waitUrls = url
		.split(',')
		.map((s: string) => s.trim())
		.filter(Boolean)
	debug(`wait: Waiting for urls ${waitUrls.join(', ')}`)

	// run every wait promise after the previous has finished
	// to avoid "noise" of debug messages
	return waitUrls.reduce((prevPromise, url) => {
		return prevPromise.then(() => {
			debug(`wait: Waiting for url ${url}`)
			return ping(url, waitTimeoutMs)
		})
	}, Promise.resolve())
}

export default async function wait(): Promise<void> {
	const command = core.getInput('wait-on')

	debug(`wait: input command : ${command}`)

	if (!command) {
		return
	}

	const waitOnTimeout = core.getInput('wait-on-timeout') || '60'
	const timeoutSeconds = parseFloat(waitOnTimeout)

	debug(`wait: Waiting during "${timeoutSeconds}" seconds`)

	if (isUrl(command)) {
		return await waitOnUrl(command, timeoutSeconds)
	}

	debug(`wait: Waiting using command "${command}"`)

	return await execCommand(command, true)
}
