import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StringComponent } from "./string";

describe("String revers algo", () => {
	it("with an even number of characters", async () => {
		// expect(StringComponent("test")).toEqual("tset");
		render(<StringComponent />);
		const stringComponent = screen.getByTestId("stringComponent");

		const input = screen.getByRole("input");
		fireEvent.input(input, {
			target: {
				value: "1234"
			}
		});

		const btn = screen.getByRole("button");
		fireEvent.click(btn);

		await waitFor(() => {
			const circleElements = screen.getAllByTestId("circle");
			const reversedString = Array.from(circleElements)
				.map((circle) => circle.textContent)
				.join("");
			expect(reversedString).toEqual("4321");
		});
	});
});
