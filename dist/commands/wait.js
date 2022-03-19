'use strict'
var __createBinding =
	(this && this.__createBinding) ||
	(Object.create
		? function (o, m, k, k2) {
				if (k2 === undefined) k2 = k
				var desc = Object.getOwnPropertyDescriptor(m, k)
				if (
					!desc ||
					('get' in desc
						? !m.__esModule
						: desc.writable || desc.configurable)
				) {
					desc = {
						enumerable: true,
						get: function () {
							return m[k]
						},
					}
				}
				Object.defineProperty(o, k2, desc)
		  }
		: function (o, m, k, k2) {
				if (k2 === undefined) k2 = k
				o[k2] = m[k]
		  })
var __setModuleDefault =
	(this && this.__setModuleDefault) ||
	(Object.create
		? function (o, v) {
				Object.defineProperty(o, 'default', {
					enumerable: true,
					value: v,
				})
		  }
		: function (o, v) {
				o['default'] = v
		  })
var __importStar =
	(this && this.__importStar) ||
	function (mod) {
		if (mod && mod.__esModule) return mod
		var result = {}
		if (mod != null)
			for (var k in mod)
				if (
					k !== 'default' &&
					Object.prototype.hasOwnProperty.call(mod, k)
				)
					__createBinding(result, mod, k)
		__setModuleDefault(result, mod)
		return result
	}
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value)
				  })
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value))
				} catch (e) {
					reject(e)
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value))
				} catch (e) {
					reject(e)
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected)
			}
			step(
				(generator = generator.apply(thisArg, _arguments || [])).next()
			)
		})
	}
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod }
	}
Object.defineProperty(exports, '__esModule', { value: true })
const execCommand_1 = __importDefault(require('./execCommand'))
const ping_1 = __importDefault(require('../utils/ping'))
const debug_1 = __importDefault(require('../utils/debug'))
const core = __importStar(require('@actions/core'))
const isUrl = (s) => /^https?:\/\//.test(s)
function waitOnUrl(url, waitOnTimeout = 60) {
	return __awaiter(this, void 0, void 0, function* () {
		;(0,
		debug_1.default)(`wait: waiting on "${url}" with timeout of ${waitOnTimeout} seconds`)
		const waitTimeoutMs = waitOnTimeout * 1000
		const waitUrls = url
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean)
		;(0, debug_1.default)(`wait: Waiting for urls ${waitUrls.join(', ')}`)
		// run every wait promise after the previous has finished
		// to avoid "noise" of debug messages
		return waitUrls.reduce((prevPromise, url) => {
			return prevPromise.then(() => {
				;(0, debug_1.default)(`wait: Waiting for url ${url}`)
				return (0, ping_1.default)(url, waitTimeoutMs)
			})
		}, Promise.resolve())
	})
}
function wait() {
	return __awaiter(this, void 0, void 0, function* () {
		const command = core.getInput('wait-on')
		;(0, debug_1.default)(`wait: input command : ${command}`)
		if (!command) {
			return
		}
		const waitOnTimeout = core.getInput('wait-on-timeout') || '60'
		const timeoutSeconds = parseFloat(waitOnTimeout)
		if (isUrl(command)) {
			return waitOnUrl(command, timeoutSeconds)
		}
		;(0, debug_1.default)(`wait: Waiting using command "${command}"`)
		return (0, execCommand_1.default)(command, true)
	})
}
exports.default = wait
