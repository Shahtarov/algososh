const ADD = '[data-testid="add"]';
const DELETE = '[data-testid="delete"]';
const CLEAR = '[data-testid="clear"]';

const RESULT = '[data-testid="result"]';
const INPUT = '[data-testid="input"]';
const CIRCLE = 'div[class*="circle_circle"]';

describe("Queue component", function () {
	beforeEach(function () {
		cy.visit("http://localhost:3000/queue");
	});

	it("buttons disabled", function () {
		cy.get(ADD).should("be.disabled");
		cy.get(DELETE).should("be.disabled");
		cy.get(CLEAR).should("be.disabled");

		cy.get(INPUT).type(1234);
		cy.get(ADD).should("not.be.disabled");

		cy.get(INPUT).clear();
		cy.get(ADD).should("be.disabled");
	});

	it("add to queue", function () {
		const testInput = 5;
		const result = ["5", "", "", "", "", "", ""];
		const expectedLength = result.length;

		cy.get(INPUT).type(testInput);
		cy.get(ADD).click();
		cy.get(RESULT).children().should("have.length", expectedLength);
		cy.get(RESULT)
			.children()
			.each(($el, index) => {
				cy.wrap($el)
					.find(CIRCLE)
					.invoke("text")
					.should("eq", result[index]);

				const toMatch = index === 0 ? /changing/ : /default/;
				cy.wrap($el)
					.find(CIRCLE)
					.invoke("attr", "class")
					.then((className) => {
						expect(className).to.match(toMatch);
					});
			});
		cy.wait(500);

		cy.get(RESULT)
			.children()
			.each(($el, index) => {
				cy.wrap($el)
					.find(CIRCLE)
					.invoke("text")
					.should("eq", result[index]);

				cy.wrap($el)
					.find(CIRCLE)
					.invoke("attr", "class")
					.then((className) => {
						expect(className).to.match(/default/);
					});
			});
	});

	it("delete from queue", function () {
		const testInput = 5;
		const result = ["", "", "", "", "", "", ""];
		const expectedLength = result.length;

		cy.get(INPUT).type(testInput);
		cy.get(ADD).click();
		cy.get(RESULT).children().should("have.length", expectedLength);
		cy.wait(500);

		cy.get(DELETE).click();
		cy.get(RESULT)
			.children()
			.each(($el, index) => {
				cy.wrap($el)
					.find(CIRCLE)
					.invoke("text")
					.should("eq", result[index]);

				cy.wrap($el)
					.find(CIRCLE)
					.invoke("attr", "class")
					.then((className) => {
						expect(className).to.match(/default/);
					});
			});
		cy.get(RESULT).children().should("have.length", expectedLength);
	});

	it("clear queue", function () {
		const input = ["5", "22", "", "", "", "", ""];
		const result = ["", "", "", "", "", "", ""];
		const expectedLength = result.length;

		cy.get(INPUT).type(input[0]);
		cy.get(ADD).click();
		cy.get(RESULT).children().should("have.length", expectedLength);
		cy.wait(500);

		cy.get(INPUT).type(input[1]);
		cy.get(ADD).click();
		cy.get(RESULT).children().should("have.length", expectedLength);
		cy.wait(500);

		cy.get(CLEAR).click();
		cy.get(RESULT)
			.children()
			.each(($el, index) => {
				cy.wrap($el)
					.find(CIRCLE)
					.invoke("text")
					.should("eq", result[index]);

				cy.wrap($el)
					.find(CIRCLE)
					.invoke("attr", "class")
					.then((className) => {
						expect(className).to.match(/default/);
					});
			});
		cy.get(RESULT).children().should("have.length", expectedLength);
	});
});
