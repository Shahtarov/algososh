interface IStack<T> {
	push: (item: T) => void;
	pop: () => T | undefined;
	clear: () => void;
	elements: () => T[];
	size: () => number;
	element: () => T | undefined;
}

export class Stack<T> implements IStack<T> {
	storage: T[] = [];

	constructor(initialElements?: T[]) {
		if (initialElements) {
			this.storage = [...initialElements];
		}
	}

	push = (item: T): void => {
		this.storage.push(item);
	};

	pop = (): T | undefined => {
		return this.storage.pop();
	};

	clear = (): void => {
		this.storage = [];
	};

	elements = (): T[] => [...this.storage];

	size = (): number => this.storage.length;

	element = (): T | undefined =>
		this.size() > 0 ? this.storage[this.size() - 1] : undefined;
}
