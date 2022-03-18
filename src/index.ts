import * as core from '@actions/core'
import build from './build'
import run from './run'
import start from './start'
import wait from './wait'

build()
	.then(start)
	.then(wait)
	.then(run)
	.then(() => process.exit(0))
	.catch((err) => {
		core.setFailed(err.message)
		process.exit(1)
	})
