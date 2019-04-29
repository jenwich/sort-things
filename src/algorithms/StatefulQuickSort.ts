export enum SQSStatus {
	Pending,
	Running,
	Finish,
}

interface IQuickSortBounds {
	low: number
	high: number
}

interface IQuickSortVariables {
	pivotIndex: number
	storeIndex: number
	currentIndex: number
	finishLoop: boolean
}

export interface IQuickSortSnapshot<T> {
	status: string
	stack: IQuickSortBounds[]
	variables: IQuickSortVariables
	compareItems: T[]
	array: T[]
	originalArray: T[]
}

export class StatefulQuickSort<T> {
	private arr: T[]
	private status: SQSStatus
	private originalArray: T[]
	private stack: IQuickSortBounds[]
	private variables: IQuickSortVariables
	private compareItems: T[]
	private snapshot: IQuickSortSnapshot<T>

	constructor(arr: T[]) {
		this.arr = [...arr]
		this.originalArray = [...this.arr]
		this.status = SQSStatus.Pending
		this.stack = []
		this.compareItems = []
	}

	public static fromSnapshot<T>(
		snapshot: IQuickSortSnapshot<T>
	): StatefulQuickSort<T> {
		let instance = new StatefulQuickSort<T>(snapshot.originalArray)
		instance.status = (<any>SQSStatus)[snapshot.status]
		instance.stack = snapshot.stack
		instance.variables = snapshot.variables
		instance.compareItems = snapshot.compareItems
		instance.arr = snapshot.array
		return instance
	}

	public isEnd(): boolean {
		return this.status === SQSStatus.Finish
	}

	public getArray(): T[] {
		return this.arr
	}

	public getCompareItems(): T[] {
		return this.compareItems
	}

	public getSnapshot(): IQuickSortSnapshot<T> {
		return this.snapshot
	}

	public preExecSort() {
		if (this.status === SQSStatus.Pending) {
			this.stack.push({
				low: 0,
				high: this.arr.length - 1,
			})
			this.variables = {
				pivotIndex: 0,
				storeIndex: 0,
				currentIndex: 0,
				finishLoop: true,
			}
			this.status = SQSStatus.Running
		}

		if (this.stack.length === 0) {
			this.status = SQSStatus.Finish
		} else {
			let { low } = this.stack[this.stack.length - 1]

			if (this.variables.finishLoop === true) {
				this.variables = {
					pivotIndex: low,
					storeIndex: low + 1,
					currentIndex: low + 1,
					finishLoop: false,
				}
			}

			let item1 = this.arr[this.variables.currentIndex]
			let item2 = this.arr[this.variables.pivotIndex]
			this.compareItems = [item1, item2]
		}

		this.saveSnapshot()
	}

	public execSort(answer: number) {
		let { low, high } = this.stack[this.stack.length - 1]

		if (answer === 0) {
			this.swap(this.variables.currentIndex, this.variables.storeIndex)
			this.variables.storeIndex++
		}

		this.variables.currentIndex++

		if (this.variables.currentIndex > high) {
			this.variables.finishLoop = true
			this.swap(this.variables.pivotIndex, this.variables.storeIndex - 1)
			let p = this.variables.storeIndex - 1

			this.stack.pop()
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
		}
	}

	public simulate() {
		this.preExecSort()
		while (!this.isEnd()) {
			let [item1, item2] = this.getCompareItems()
			let answer = item1 < item2 ? 0 : 1
			this.execSort(answer)
			this.preExecSort()
		}
	}

	private saveSnapshot() {
		this.snapshot = {
			status: (<any>SQSStatus)[this.status],
			stack: this.stack,
			variables: this.variables,
			compareItems: this.compareItems,
			array: this.arr,
			originalArray: this.originalArray,
		}
	}

	private swap(index1: number, index2: number) {
		;[this.arr[index1], this.arr[index2]] = [this.arr[index2], this.arr[index1]]
	}
}
