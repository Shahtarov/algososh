import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StringComponent } from "./string";

describe("String reversComponent", () => {
	it("even", async () => {
		render(
			<MemoryRouter>
				<StringComponent />
			</MemoryRouter>
		);
		const input = screen.getByRole("textbox");
		const button = screen.getByRole("button", { name: "Развернуть" });

		fireEvent.change(input, { target: { value: "12" } });
		fireEvent.click(button);

		await waitFor(() => {
			const circles = screen.getAllByTestId("circle");

			const letters = circles.map((circle) => circle.textContent).join("");
			expect(letters).toBe("21");
		});
	});

	it("odd", async () => {
		render(
			<MemoryRouter>
				<StringComponent />
			</MemoryRouter>
		);
		const input = screen.getByRole("textbox");
		const button = screen.getByRole("button", { name: "Развернуть" });

		fireEvent.change(input, { target: { value: "123" } });
		fireEvent.click(button);

		await waitFor(() => {
			const circles = screen.getAllByTestId("circle");
			const letters = circles.map((circle) => circle.textContent).join("");

			expect(letters).toBe("321");
		});
	});

	it("one symbol", async () => {
		render(
			<MemoryRouter>
				<StringComponent />
			</MemoryRouter>
		);
		const input = screen.getByRole("textbox");
		const button = screen.getByRole("button", { name: "Развернуть" });

		fireEvent.change(input, { target: { value: "1" } });
		fireEvent.click(button);

		await waitFor(() => {
			expect(button).not.toBeDisabled();
		});

		await waitFor(() => {
			const circles = screen.getAllByTestId("circle");
			const letters = circles.map((circle) => circle.textContent).join("");
			expect(letters).toBe("1");
		});
	});

	it("empty string", async () => {
		render(
			<MemoryRouter>
				<StringComponent />
			</MemoryRouter>
		);
		const input = screen.getByRole("textbox");
		const button = screen.getByRole("button", { name: "Развернуть" });
		const circle = screen.queryByTestId("circle");
		fireEvent.change(input, { target: { value: "" } });
		fireEvent.click(button);

		await waitFor(() => {
			expect(circle).toBeNull();
		});
	});
});
