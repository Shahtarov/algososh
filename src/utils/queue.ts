interface IQueue<T> {
	enqueue: (item: T) => void;
	dequeue: () => void;
	clear: () => void;
	isEmpty: () => boolean;
	elements: () => (T | null)[];
	element: () => T | null;
}

export class Queue<T> implements IQueue<T> {
	private storage: T[] = [];
	head: number = 0;
	tail: number = 0;
	private readonly size: number = 0;
	private length: number = 0;

	constructor(size: number) {
		this.size = size;
		this.storage = Array(size);
	}

	clear = () => {
		this.storage = Array(this.size);
		this.head = 0;
		this.tail = 0;
		this.length = 0;
	};

	isEmpty = () => this.length === 0;

	enqueue = (item: T): void => {
		if (this.length >= this.size) {
			throw new Error("Maximum length exceeded");
		}
		this.storage[this.tail % this.size] = item;
		this.tail++;
		this.length++;
	};

	dequeue = (): void => {
		if (this.isEmpty()) {
			throw new Error("No elements in the queue");
		}
		delete this.storage[this.head % this.size];
		this.head++;
		this.length--;
	};

	elements = () => this.storage;

	element = (): T | null => {
		if (this.isEmpty()) {
			throw new Error("No elements in the queue");
		}
		return this.storage[this.head % this.size];
	};
}
