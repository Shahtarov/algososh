export class LinkedListNode<T> {
	value: T;
	next: LinkedListNode<T> | null;

	constructor(value: T, next: LinkedListNode<T> | null = null) {
		this.value = value;
		this.next = next;
	}
}

export class LinkedList<T> {
	head: LinkedListNode<T> | null = null;
	tail: LinkedListNode<T> | null = null;
	private _size: number = 0;

	constructor(initialElements: T[]) {
		this.build(initialElements);
	}

	isEmpty() {
		return this.head === null;
	}

	private incrementSize() {
		this._size++;
	}

	private decrementSize() {
		this._size--;
	}

	updateSize() {
		let size = 0;
		let current = this.head;
		while (current !== null) {
			size++;
			current = current.next;
		}
		this._size = size;
	}

	build(elements: T[]) {
		for (const element of elements) {
			this.append(element);
		}
	}

	addByIndex(idx: number, item: T) {
		if (idx < 0) return;
		const node = new LinkedListNode(item);
		let temp = this.head;
		let i = 0;

		while (temp !== null && i < idx - 1) {
			temp = temp.next;
			i += 1;
		}
		if (temp !== null) {
			node.next = temp.next;
			temp.next = node;
			if (temp === this.tail) {
				this.tail = node;
			}
			this.incrementSize();
		}
	}

	deleteByIndex(idx: number) {
		if (idx < 0 || this.isEmpty()) return;

		let node: LinkedListNode<T> | null = this.head;
		let prev: LinkedListNode<T> | null = null;
		let i = 0;

		while (node !== null && i < idx) {
			prev = node;
			node = node.next;
			i += 1;
		}
		if (node !== null) {
			if (prev === null) {
				this.head = node.next;
				if (this.head === null) {
					this.tail = null;
				}
			} else {
				prev.next = node.next;
				if (node === this.tail) {
					this.tail = prev;
				}
			}
			this.decrementSize();
		}
	}

	prepend(item: T) {
		this.addByIndex(0, item);
	}

	append(item: T) {
		const node = new LinkedListNode(item);
		if (this.isEmpty()) {
			this.head = node;
			this.tail = node;
		} else {
			this.tail!.next = node;
			this.tail = node;
		}
		this.incrementSize();
	}

	deleteHead() {
		this.deleteByIndex(0);
	}

	deleteTail() {
		this.deleteByIndex(this._size - 1);
	}

	toArray() {
		const elements: T[] = [];
		let temp = this.head;

		while (temp !== null) {
			elements.push(temp.value);
			temp = temp.next;
		}
		return elements;
	}

	get size() {
		return this._size;
	}
}
