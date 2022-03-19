import * as core from '@actions/core'
import build from './commands/build'
import run from './commands/run'
import start from './commands/start'
import wait from './commands/wait'

build()
	.then(start)
	.then(wait)
	.then(run)
	.then(() => process.exit(0))
	.catch((err) => {
		core.setFailed(err.message)
		process.exit(1)
	})
