import * as core from '@actions/core'

export default function debug(str: string): void {
	if (core.getInput('debug') === 'true') {
		console.log(str)
	}
}
