'use strict'
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
const cliParser = require('argument-vector')()
const io = require('@actions/io')
const exec = require('@actions/exec')
const debug_1 = __importDefault(require('./utils/debug'))
function execCommand(command, waitToFinish = true) {
	return __awaiter(this, void 0, void 0, function* () {
		;(0, debug_1.default)(`execCommand: Run full command : ${command}`)
		const args = cliParser.parse(command)
		return io.which(args[0], true).then((toolPath) => {
			;(0, debug_1.default)(`execCommand: found command "${toolPath}"`)
			;(0, debug_1.default)(
				`execCommand: with arguments ${args.slice(1).join(' ')}`
			)
			const toolArguments = args.slice(1)
			const argsString = toolArguments.join(' ')
			;(0, debug_1.default)(
				`execCommand: running ${toolPath} ${argsString}`
			)
			;(0, debug_1.default)(
				`execCommand: waiting for the command to finish? ${waitToFinish}`
			)
			const promise = exec.exec(`"${toolPath}"`, toolArguments, {})
			if (waitToFinish) {
				return promise
			}
		})
	})
}
exports.default = execCommand
