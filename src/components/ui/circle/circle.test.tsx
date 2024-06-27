import { render, screen } from "@testing-library/react";
import { Circle } from "./circle";
import { ElementStates } from "../../../types/element-states";

describe("Circle component", () => {
	it("text inside", () => {
		render(<Circle letter={"text"} />);

		const circle = screen.getByTestId("circle");
		const textInCircle = screen.getByTestId("textInside");

		expect(textInCircle).toHaveTextContent(/text/i);
		expect(circle).toMatchSnapshot();
	});

	it("without text inside", () => {
		render(<Circle />);

		const circle = screen.getByTestId("circle");
		const textInCircle = screen.getByTestId("textInside");

		expect(textInCircle).toHaveTextContent("");
		expect(circle).toMatchSnapshot();
	});

	it("text in head", () => {
		render(<Circle head="text" />);

		const circle = screen.getByTestId("circle");
		const textInHead = screen.getByTestId("head");

		expect(textInHead).toHaveTextContent(/text/i);
		expect(circle).toMatchSnapshot();
	});

	it("react element in head", () => {
		render(<Circle head={<div data-testid="inner-element" />} />);

		const circle = screen.getByTestId("circle");
		const innerElement = screen.getByTestId("inner-element");

		expect(innerElement).toBeInTheDocument();
		expect(circle).toMatchSnapshot();
	});

	it("text in tail", () => {
		render(<Circle tail="text" />);

		const circle = screen.getByTestId("circle");
		const textInTail = screen.getByTestId("tail");

		expect(textInTail).toHaveTextContent(/text/i);
		expect(circle).toMatchSnapshot();
	});

	it("number in index", () => {
		render(<Circle index={10} />);

		const circle = screen.getByTestId("circle");
		const index = screen.getByTestId("index");

		expect(index).toHaveTextContent(/10/);
		expect(circle).toMatchSnapshot();
	});

	it("is small", () => {
		render(<Circle isSmall={true} />);

		const circle = screen.getByTestId("circle");
		const state = screen.getByTestId("state");

		expect(state).toBeInTheDocument();
		expect(state).toHaveClass("small");
		expect(circle).toMatchSnapshot();
	});

	it("is default", () => {
		render(<Circle state={ElementStates.Default} />);

		const circle = screen.getByTestId("circle");
		const state = screen.getByTestId("state");

		expect(state).toBeInTheDocument();
		expect(state).toHaveClass("default");
		expect(circle).toMatchSnapshot();
	});

	it("is changing", () => {
		render(<Circle state={ElementStates.Changing} />);

		const circle = screen.getByTestId("circle");
		const state = screen.getByTestId("state");

		expect(state).toBeInTheDocument();
		expect(state).toHaveClass("changing");
		expect(circle).toMatchSnapshot();
	});

	it("is modified", () => {
		render(<Circle state={ElementStates.Modified} />);

		const circle = screen.getByTestId("circle");
		const state = screen.getByTestId("state");

		expect(state).toBeInTheDocument();
		expect(state).toHaveClass("modified");
		expect(circle).toMatchSnapshot();
	});
});
