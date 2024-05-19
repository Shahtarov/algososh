import { elStateColors } from "../../src/constants/constants";
import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { findCircle } from "../../src/constants/constants";

describe("String component", function () {
	beforeEach(function () {
		cy.visit("http://localhost:3000/recursion");
	});

	it("Empty input", function () {
		cy.contains("Строка");
		cy.get("input").should("be.empty");
		cy.get("button").last().should("be.disabled");
	});

	it("Revers string", function () {
		const inputValue = "12345";

		cy.get("input").as("currInput");
		cy.get("@currInput").type(inputValue);

		cy.get("button").contains("Развернуть").as("currButton");
		cy.get("@currButton").contains("Развернуть").click();

		cy.get(findCircle)
			.as("circles")
			.each((item, index) => {
				switch (index) {
					case 0:
						cy.wrap(item)
							.should(
								"have.text",
								inputValue[inputValue.length - 1 - index]
							)
							.and("have.css", "border", elStateColors.modified);
						break;
					case inputValue.length - 1:
						cy.wrap(item)
							.should(
								"have.text",
								inputValue[inputValue.length - 1 - index]
							)
							.and("have.css", "border", elStateColors.modified);
						break;
					case 1:
						cy.wrap(item)
							.should("have.text", inputValue[index])
							.and("have.css", "border", elStateColors.changing);
						break;
					case inputValue.length - 2:
						cy.wrap(item)
							.should("have.text", inputValue[index])
							.and("have.css", "border", elStateColors.changing);
						break;
					default:
						cy.wrap(item)
							.should("have.text", inputValue[index])
							.and("have.css", "border", elStateColors.default);
						break;
				}
			});

		cy.get("@circles").each((item, index) => {
			switch (index) {
				case 0:
					cy.wrap(item)
						.should(
							"have.text",
							inputValue[inputValue.length - 1 - index]
						)
						.and("have.css", "border", elStateColors.modified);
					break;
				case inputValue.length - 1:
					cy.wrap(item)
						.should(
							"have.text",
							inputValue[inputValue.length - 1 - index]
						)
						.and("have.css", "border", elStateColors.modified);
					break;
				case 1:
					cy.wrap(item)
						.should(
							"have.text",
							inputValue[inputValue.length - 1 - index]
						)
						.and("have.css", "border", elStateColors.modified);
					break;
				case inputValue.length - 2:
					cy.wrap(item)
						.should(
							"have.text",
							inputValue[inputValue.length - 1 - index]
						)
						.and("have.css", "border", elStateColors.modified);
					break;
				default:
					cy.wrap(item)
						.should("have.text", inputValue[index])
						.and("have.css", "border", elStateColors.modified);
					break;
			}
		});

		cy.wait(SHORT_DELAY_IN_MS);

		cy.get("@circles").each((item, index) => {
			cy.wrap(item)
				.should("have.text", inputValue[inputValue.length - 1 - index])
				.and("have.css", "border", elStateColors.modified);
		});
	});
});
