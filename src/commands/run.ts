import execCommand from './execCommand'
import debug from '../utils/debug'
import * as core from '@actions/core'

export default async function run(): Promise<void | any[]> {
	const command = core.getInput('command')

	debug(`run: input command : ${command}`)

	if (!command) {
		return
	}

	const separateCommands = command
		.split(/,|\n/)
		.map((s: string) => s.trim())
		.filter(Boolean)

	debug(
		`run: Separated ${
			separateCommands.length
		} main commands ${separateCommands.join(', ')}`
	)

	return Promise.all(
		separateCommands.map(async (command: string) => {
			return execCommand(command, true)
		})
	)
}
