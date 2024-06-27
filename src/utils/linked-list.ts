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

	constructor(initialElements: T[]) {
		this.build(initialElements);
	}

	build(elements: T[]) {
		for (let i = 0; i < elements.length; i++) {
			const node = new LinkedListNode(elements[i]);

			if (this.head === null) {
				this.head = node;
			} else if (this.tail !== null) {
				this.tail.next = node;
			}
			this.tail = node;
		}
	}

	prepend(item: T) {
		const node = new LinkedListNode(item, this.head);
		this.head = node;
	}

	append(item: T) {
		const node = new LinkedListNode(item);
		if (this.tail !== null) {
			this.tail.next = node;
		}
		this.tail = node;
	}

	addByIndex(idx: number, item: T) {
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
		}
	}

	deleteByIndex(idx: number) {
		let node: LinkedListNode<T> | null = this.head;
		let prev: LinkedListNode<T> | null = null;
		let i = 0;

		while (node !== null && i < idx) {
			prev = node;
			node = node.next;
			i += 1;
		}
		if (node !== null && prev !== null) {
			prev.next = node.next;
		}
	}

	deleteHead() {
		this.head = this.head?.next ?? null;
	}

	deleteTail() {
		let node: LinkedListNode<T> | null = this.head;
		while (node !== null && node.next !== null && node.next.next !== null) {
			node = node.next;
		}
		if (node !== null) {
			node.next = null;
		}
		this.tail = node;
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

	size() {
		return this.toArray().length;
	}
}
