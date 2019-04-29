import fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

export class JsonDB {
	constructor(private location: string) {}

	write(json: any): Promise<void> {
		let data = JSON.stringify(json)
		return writeFile(this.location, data, { encoding: 'utf8' })
	}

	read(): Promise<any> {
		return readFile(this.location, { encoding: 'utf8' }).then(
			(value: string) => {
				return JSON.parse(value)
			}
		)
	}
}
