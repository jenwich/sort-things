import { QuickSort, StatefulQuickSort } from '../../src/algorithms/quicksort'

let testCases = [
	[[1, 2, 3, 4], [1, 2, 3, 4]],
	[[5, 7, 3, 2, 8, 1, 6, 10, 9, 4], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
	[[2, 4, 5, 1, 3], [1, 2, 3, 4, 5]],
]

describe('QuickSort', () => {
	it('should sort', () => {
		for (let tc of testCases) {
			let qs = new QuickSort(tc[0])
			qs.sort()
			let got = qs.getArray(),
				want = tc[1]
			expect(got).toEqual(want)
		}
	})
})

describe('StatefulQuickSort', () => {
	it('should sort', () => {
		for (let tc of testCases) {
			let qs = new StatefulQuickSort(tc[0])
			qs.sort()
			let got = qs.getArray(),
				want = tc[1]
			expect(got).toEqual(want)
		}
	})
})

// let sortStep = [
// 	[2, 4, 5, 1, 3],
// 	[2, 4, 5, 1, 3],
// 	[2, 1, 5, 4, 3],
// 	[2, 1, 5, 4, 3],
// 	[1, 2, 5, 4, 3],
// 	[1, 2, 5, 4, 3],
// 	[1, 2, 3, 4, 5],
// ]
