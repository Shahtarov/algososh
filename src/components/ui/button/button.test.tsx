import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button component", () => {
	it("button with text", () => {
		render(<Button text={"text"} />);

		const btn = screen.getByRole("button");

		expect(btn).toHaveTextContent(/text/i);
		expect(btn).toMatchSnapshot();
	});

	it("button without text", () => {
		render(<Button />);

		const btn = screen.getByRole("button");

		expect(btn).toHaveTextContent("");
		expect(btn).toMatchSnapshot();
	});

	it("locked button", () => {
		render(<Button disabled={true} />);

		const btn = screen.getByRole("button");

		expect(btn).toBeDisabled();
		expect(btn).toMatchSnapshot();
	});

	it("button with a loading indicator", () => {
		render(<Button isLoader={true} />);

		const btn = screen.getByRole("button");
		const img = screen.getByRole("img");

		expect(img).toBeInTheDocument();
		expect(btn).toMatchSnapshot();
	});

	it("button with callback", () => {
		const mockCallback = jest.fn();
		render(<Button onClick={mockCallback} />);

		const btn = screen.getByRole("button");
		fireEvent.click(btn);

		expect(mockCallback).toHaveBeenCalledTimes(1);
		expect(btn).toMatchSnapshot();
	});
});
