import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import {
	StatefulQuickSort,
	IQuickSortSnapshot,
	SQSStatus,
} from '../algorithms/StatefulQuickSort'
import { JsonDB } from '../utils/JsonDB'

let app = express()

app.listen(3000, () => {
	console.log('Listening on PORT', 3000)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
	res.json({ ok: 1 })
})

app.post('/create', async (req: Request, res: Response) => {
	let items: string[] = req.body['items'] || []

	let qs = new StatefulQuickSort(items)
	qs.preExecSort()
	let snapshot = qs.getSnapshot()

	let jsonDB = new JsonDB('db.json')
	await jsonDB.write(snapshot)

	res.json(resultCompare(snapshot))
})

app.post('/next', async (req: Request, res: Response) => {
	let answer: number = req.body['answer']
	let jsonDB = new JsonDB('db.json')
	let snapshot: IQuickSortSnapshot<string> = await jsonDB.read()
	let qs = StatefulQuickSort.fromSnapshot(snapshot)

	if (qs.isEnd()) {
		res.json({
			end: true,
			items: snapshot.array,
			originalItems: snapshot.originalArray,
		})
	} else {
		qs.execSort(answer)
		qs.preExecSort()

		snapshot = qs.getSnapshot()
		await jsonDB.write(snapshot)

		if (qs.isEnd()) {
			res.json(resultEnd(snapshot))
		} else {
			res.json(resultCompare(snapshot))
		}
	}
})

const resultItems = (snapshot: IQuickSortSnapshot<string>) => ({
	items: snapshot.array,
	originalItems: snapshot.originalArray,
})

const resultCompare = (snapshot: IQuickSortSnapshot<string>) => ({
	end: snapshot.status === SQSStatus.Finish,
	...resultItems(snapshot),
	compareItems: snapshot.compareItems,
})

const resultEnd = (snapshot: IQuickSortSnapshot<string>) => ({
	end: true,
	...resultItems(snapshot),
})
