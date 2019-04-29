export class SimpleQuickSort<T> {
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
