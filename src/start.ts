import execCommand from './execCommand'
import debug from './utils/debug'
import * as core from '@actions/core'

export default async function start(): Promise<void | void[]> {
	const command = core.getInput('start')

	debug(`start: input command : ${command}`)

	if (!command) {
		return
	}

	const separateStartCommands = command
		.split(/,|\n/)
		.map((s: string) => s.trim())
		.filter(Boolean)

	debug(
		`start: Separated ${
			separateStartCommands.length
		} start commands ${separateStartCommands.join(', ')}`
	)

	return await Promise.all(
		separateStartCommands.map((startCommand: string) => {
			return execCommand(startCommand, false)
		})
	)
}
