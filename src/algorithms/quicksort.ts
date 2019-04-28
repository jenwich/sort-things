export class QuickSort<T> {
	constructor(private arr: T[]) {}

	public getArray(): T[] {
		return this.arr
	}

	public sort() {
		this.quickSortRecursive(0, this.arr.length - 1)
	}

	private quickSortRecursive(low: number, high: number) {
		if (low < high) {
			let p = this.partition(low, high)
			this.quickSortRecursive(low, p - 1)
			this.quickSortRecursive(p + 1, high)
		}
	}

	private partition(low: number, high: number): number {
		let pivotIndex = low
		let pivot = this.arr[pivotIndex]
		let storeIndex = pivotIndex + 1
		for (let i = pivotIndex + 1; i <= high; i++) {
			if (this.arr[i] < pivot) {
				this.swap(i, storeIndex)
				storeIndex++
			}
		}
		this.swap(pivotIndex, storeIndex - 1)
		return storeIndex - 1
	}

	private swap(index1: number, index2: number) {
		;[this.arr[index1], this.arr[index2]] = [this.arr[index2], this.arr[index1]]
	}
}

interface StackInstance {
	low: number
	high: number
}

interface QuickSortPartitionSnapshot {
	pivotIndex: number
	storeIndex: number
	i: number
	finish: boolean
}

export class StatefulQuickSort<T> {
	private start: boolean
	private end: boolean
	private stack: StackInstance[]
	private partitionSnapshots: QuickSortPartitionSnapshot

	constructor(private arr: T[]) {
		this.start = false
		this.end = false
		this.stack = []
	}

	public getArray(): T[] {
		return this.arr
	}

	public next() {
		if (this.start === false) {
			this.init()
			this.start = true
		}

		if (this.stack.length === 0) {
			this.end = true
		} else {
			let { low, high } = this.stack.pop()
			let pivotIndex: number, storeIndex: number, i: number

			if (this.partitionSnapshots.finish === true) {
				this.partitionSnapshots.finish = false
				pivotIndex = low
				storeIndex = pivotIndex + 1
				i = storeIndex + 1
			} else {
				pivotIndex = this.partitionSnapshots.pivotIndex
				storeIndex = this.partitionSnapshots.storeIndex
				i = this.partitionSnapshots.i
			}

			if (this.arr[i] < this.arr[pivotIndex]) {
				this.swap(i, storeIndex)
				storeIndex++
			}
			i++

			if (i > high) {
				this.partitionSnapshots.finish = true
				this.swap(pivotIndex, storeIndex - 1)
				let p = storeIndex - 1

				if (p + 1 < high) {
					this.stack.push({
						low: p + 1,
						high: high,
					})
				}
				if (low < p - 1) {
					this.stack.push({
						low: low,
						high: p - 1,
					})
				}
			} else {
				this.partitionSnapshots = {
					pivotIndex,
					storeIndex,
					i,
					finish: false,
				}
				this.stack.push({ low, high })
			}
		}
	}

	public sort() {
		while (!this.isEnd()) {
			this.next()
		}
	}

	public isEnd(): boolean {
		return this.end
	}

	private init() {
		this.partitionSnapshots = {
			pivotIndex: 0,
			storeIndex: 0,
			i: 0,
			finish: true,
		}
		this.stack.push({
			low: 0,
			high: this.arr.length - 1,
		})
	}

	private swap(index1: number, index2: number) {
		;[this.arr[index1], this.arr[index2]] = [this.arr[index2], this.arr[index1]]
	}
}
