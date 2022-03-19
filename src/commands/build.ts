import debug from '../utils/debug'
import execCommand from './execCommand'
import * as core from '@actions/core'

export default async function build(): Promise<void> {
	const command = core.getInput('build')

	debug(`build: input command : ${command}`)

	if (command === '') {
		return
	}

	return execCommand(command, true)
}
