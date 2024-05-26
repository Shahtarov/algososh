import { elStateColors } from "../../src/constants/constants";
import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { findCircle } from "../../src/constants/constants";

describe("Stack component", function () {
	beforeEach(function () {
		cy.visit("stack");
		cy.contains("Добавить").as("btnAdd");
		cy.contains("Удалить").as("btnDelete");
		cy.contains("Очистить").as("btnReset");
	});

	it("Empty input", function () {
		cy.contains("Стек");
		cy.get("input").should("be.empty");
		cy.get("@btnAdd").should("be.disabled");
	});

	it("One element in stack", function () {
		const testValues = ["1", "2", "text"];
		testValues.forEach((value, index) => {
			cy.get("input").as("currInput");
			cy.get("@currInput").type(value);
			cy.get("@btnAdd").click();
			cy.get(findCircle).each((circle, circIndex) => {
				circIndex === index
					? cy
							.wrap(circle)
							.should("have.text", testValues[circIndex])
							.and("have.css", "border", elStateColors.changing)
					: cy
							.wrap(circle)
							.should("have.text", testValues[circIndex])
							.and("have.css", "border", elStateColors.default);
			});
			cy.wait(SHORT_DELAY_IN_MS);
		});
	});

	it("Delete element from stack", function () {
		const testValues = ["1", "2", "text"];
		testValues.forEach((value) => {
			cy.get("input").type(value);
			cy.get("@btnAdd").click();
		});

		cy.get("@btnDelete").click();
		cy.get(findCircle).each((value, index) => {
			index === testValues.length - 1
				? cy
						.wrap(value)
						.should("have.text", testValues[index])
						.and("have.css", "border", elStateColors.changing)
				: cy
						.wrap(value)
						.should("have.text", testValues[index])
						.and("have.css", "border", elStateColors.default);
		});
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(findCircle)
			.should("have.length", testValues.length - 1)
			.each((value, index) => {
				cy.wrap(value)
					.should("have.text", testValues[index])
					.and("have.css", "border", elStateColors.default);
			});
	});

	it("Clear stack", function () {
		const testValues = ["1", "2", "text"];
		testValues.forEach((value) => {
			cy.get("input").type(value);
			cy.get("@btnAdd").click();
		});

		cy.get("@btnReset").click();
		cy.get(findCircle).should("not.exist");
	});
});
