import { sortAlgo } from "./sorting-page";
import { ElementStates } from "../../types/element-states";

describe("Sorting page", () => {
	it("Empty array", () => {
		const input: { data: number; state: ElementStates }[] = [].map((item) => {
			return { data: item, state: ElementStates.Default };
		});

		expect(sortAlgo(input, "bubble", "asc")).toEqual(input);
		expect(sortAlgo(input, "bubble", "desc")).toEqual(input);
		expect(sortAlgo(input, "selection", "asc")).toEqual(input);
		expect(sortAlgo(input, "selection", "desc")).toEqual(input);
	});

	it("Array with one element", () => {
		const input: { data: number; state: ElementStates }[] = [
			{ data: 1, state: ElementStates.Default }
		];

		expect(sortAlgo(input, "bubble", "asc")).toEqual(input);
		expect(sortAlgo(input, "bubble", "desc")).toEqual(input);
		expect(sortAlgo(input, "selection", "asc")).toEqual(input);
		expect(sortAlgo(input, "selection", "desc")).toEqual(input);
	});

	it("Array with multiple elements", () => {
		const input: { data: number; state: ElementStates }[] = [
			{ data: 1, state: ElementStates.Default },
			{ data: 5, state: ElementStates.Default },
			{ data: 10, state: ElementStates.Default },
			{ data: -1, state: ElementStates.Default }
		];
		const answerAsc: { data: number; state: ElementStates }[] = [
			{ data: -1, state: ElementStates.Default },
			{ data: 1, state: ElementStates.Default },
			{ data: 5, state: ElementStates.Default },
			{ data: 10, state: ElementStates.Default }
		];
		const answerDesc: { data: number; state: ElementStates }[] = [
			{ data: 10, state: ElementStates.Default },
			{ data: 5, state: ElementStates.Default },
			{ data: 1, state: ElementStates.Default },
			{ data: -1, state: ElementStates.Default }
		];

		expect(sortAlgo(input, "bubble", "asc")).toEqual(answerAsc);
		expect(sortAlgo(input, "bubble", "desc")).toEqual(answerDesc);
		expect(sortAlgo(input, "selection", "asc")).toEqual(answerAsc);
		expect(sortAlgo(input, "selection", "desc")).toEqual(answerDesc);
	});
});
