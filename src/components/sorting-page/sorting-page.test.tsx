import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SortingPage } from "./sorting-page";
import { Direction } from "../../types/direction";
import { MemoryRouter } from "react-router-dom";

describe("SortingPage", () => {
	const generateArray = (array: number[]) => {
		jest.spyOn(Math, "random").mockImplementation(() => array.shift()! / 100);
	};

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test("correctly sorts an empty array", () => {
		generateArray([]);
		render(
			<MemoryRouter>
				<SortingPage />
			</MemoryRouter>
		);

		const newArrayButton = screen.getByText(/Новый массив/i);
		fireEvent.click(newArrayButton);

		const columns = screen.queryAllByTestId("column");
		expect(columns).toHaveLength(0);
	});

	test("correctly sorts an array with one element", () => {
		generateArray([42]);
		render(
			<MemoryRouter>
				<SortingPage />
			</MemoryRouter>
		);
		const newArrayButton = screen.getByText(/Новый массив/i);
		fireEvent.click(newArrayButton);

		const ascButton = screen.getByText(/По возрастанию/i);
		fireEvent.click(ascButton);

		const columns = screen.getAllByTestId("column");
		expect(columns).toHaveLength(1);
		expect(columns[0]).toHaveTextContent("42");
	});

	test("correctly sorts an array with multiple elements", async () => {
		generateArray([4, 3, 2, 1]);
		render(
			<MemoryRouter>
				<SortingPage />
			</MemoryRouter>
		);

		const newArrayButton = screen.getByText(/Новый массив/i);
		fireEvent.click(newArrayButton);

		const ascButton = screen.getByText(/По возрастанию/i);
		fireEvent.click(ascButton);

		await waitFor(() => {
			const columns = screen.getAllByTestId("column");
			expect(columns).toHaveLength(4);
		});

		await waitFor(() => {
			const columns = screen.getAllByTestId("column");
			expect(columns[0]).toHaveTextContent("1");
		});

		await waitFor(() => {
			const columns = screen.getAllByTestId("column");
			expect(columns[1]).toHaveTextContent("2");
		});

		await waitFor(() => {
			const columns = screen.getAllByTestId("column");
			expect(columns[2]).toHaveTextContent("3");
		});

		await waitFor(() => {
			const columns = screen.getAllByTestId("column");
			expect(columns[3]).toHaveTextContent("4");
		});
	});
});
