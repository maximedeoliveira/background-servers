import debug from './debug'
import got from 'got'

/**
 * A small utility for checking when an URL responds, kind of
 * a poor man's https://www.npmjs.com/package/wait-on. This version
 * is implemented using https://github.com/sindresorhus/got
 */
export default function ping(url: string, timeout: number): Promise<any> {
	if (!timeout) {
		throw new Error('Expected timeout in ms')
	}

	// make copy of the error codes that "got" retries on
	// @ts-ignore
	const errorCodes = [...got.defaults.options.retry.errorCodes]
	errorCodes.push('ESOCKETTIMEDOUT')

	// we expect the server to respond within a time limit
	// and if it does not - retry up to total "timeout" duration
	const individualPingTimeout = Math.min(timeout, 30000)

	// add to the timeout max individual ping timeout
	// to avoid long-waiting ping from "rolling" over the end
	// and preventing pinging the last time
	timeout += individualPingTimeout
	const limit = Math.ceil(timeout / individualPingTimeout)

	debug(`ping: total ping timeout ${timeout}`)
	debug(`ping: individual ping timeout ${individualPingTimeout}ms`)
	debug(`ping: retries limit ${limit}`)

	const start = +new Date()
	return got(url, {
		headers: {
			Accept: 'text/html, application/json, text/plain, */*',
		},
		timeout: { request: individualPingTimeout },
		// @ts-ignore
		errorCodes,
		retry: {
			limit,
			calculateDelay({ error, attemptCount }: any) {
				if (error) {
					debug(`ping: got error ${JSON.stringify(error)}`)
				}
				const now = +new Date()
				const elapsed = now - start
				debug(
					`ping: ${elapsed}ms ${error.method} ${error.host} ${error.code} attempt ${attemptCount}`
				)
				if (elapsed > timeout) {
					console.error(
						'%s timed out on retry %d of %d, elapsed %dms, limit %dms',
						url,
						attemptCount,
						limit,
						elapsed,
						timeout
					)
					return 0
				}

				// if the error code is ECONNREFUSED use shorter timeout
				// because the server is probably starting
				if (error.code === 'ECONNREFUSED') {
					return 1000
				}

				// default "long" timeout
				return individualPingTimeout
			},
		},
	}).then(() => {
		const now = +new Date()
		const elapsed = now - start
		debug(`ping: pinging ${url} has finished ok after ${elapsed}ms`)
	})
}
