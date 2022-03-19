const cliParser = require('argument-vector')()
const io = require('@actions/io')
const exec = require('@actions/exec')
import debug from '../utils/debug'

export default async function execCommand(
	command: string,
	waitToFinish = true
): Promise<void> {
	debug(`execCommand: Run full command : ${command}`)
	const args = cliParser.parse(command)

	return io.which(args[0], true).then((toolPath: string) => {
		debug(`execCommand: found command "${toolPath}"`)
		debug(`execCommand: with arguments ${args.slice(1).join(' ')}`)

		const toolArguments = args.slice(1)
		const argsString = toolArguments.join(' ')
		debug(`execCommand: running ${toolPath} ${argsString}`)
		debug(`execCommand: waiting for the command to finish? ${waitToFinish}`)

		const promise = exec.exec(`"${toolPath}"`, toolArguments, {})

		if (waitToFinish) {
			return promise
		}
	})
}
