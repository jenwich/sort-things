import { StatefulQuickSort } from '../../src/algorithms/StatefulQuickSort'

let testCases = [
	[[1, 2, 3, 4], [1, 2, 3, 4]],
	[[5, 7, 3, 2, 8, 1, 6, 10, 9, 4], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
	[[2, 4, 5, 1, 3], [1, 2, 3, 4, 5]],
]

describe('StatefulQuickSort', () => {
	it('simulate sort', () => {
		for (let tc of testCases) {
			let qs = new StatefulQuickSort(tc[0], {})
			qs.simulate()
			let got = qs.getArray(),
				want = tc[1]
			expect(got).toEqual(want)
		}
	})

	it('simulate sort with import snapshot', () => {
		for (let tc of testCases) {
			let qs = new StatefulQuickSort(tc[0], {})

			qs.preExecSort()
			let snapshot = qs.getSnapshot()

			while (!qs.isEnd()) {
				qs = StatefulQuickSort.fromSnapshot(snapshot)
				let [item1, item2] = qs.getCompareItems()
				let answer = item1 < item2 ? 0 : 1
				qs.execSort(answer)
				qs.preExecSort()
				snapshot = qs.getSnapshot()
			}

			let want = tc[1]
			expect(qs.getArray()).toEqual(want)
		}
	})

	it('simulate sort with limit', () => {
		let limits = [2, 3, 2]
		for (let i in testCases) {
			let tc = testCases[i]
			let qs = new StatefulQuickSort(tc[0], {
				limit: limits[i],
			})
			qs.simulate()
			let got = qs.getArray().slice(0, limits[i]),
				want = tc[1].slice(0, limits[i])
			expect(got).toEqual(want)
		}
	})
})
