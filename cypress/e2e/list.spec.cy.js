const VALUE = '[data-testid="input"]';
const INDEX = '[data-testid="index"]';

const ADD_TO_HEAD = '[data-testid="add-to-head"]';
const ADD_TO_TAIL = '[data-testid="add-to-tail"]';
const ADD_BY_INDEX = '[data-testid="add-by-index"]';

const DELETE_FROM_HEAD = '[data-testid="delete-from-head"]';
const DELETE_FROM_TAIL = '[data-testid="delete-from-tail"]';
const DELETE_BY_INDEX = '[data-testid="delete-by-index"]';

describe("List component", function () {
	beforeEach(function () {
		cy.visit("http://localhost:3000/list");
	});

	it("buttons disabled", function () {
		cy.get(ADD_TO_HEAD).should("be.disabled");
		cy.get(ADD_TO_TAIL).should("be.disabled");
		cy.get(ADD_BY_INDEX).should("be.disabled");
		cy.get(DELETE_BY_INDEX).should("be.disabled");

		cy.get(VALUE).type(1234);
		cy.get(ADD_TO_HEAD).should("not.be.disabled");
		cy.get(ADD_TO_TAIL).should("not.be.disabled");

		cy.get(INDEX).eq(0).type(1);
		cy.get(ADD_BY_INDEX).should("not.be.disabled");
		cy.get(DELETE_BY_INDEX).should("not.be.disabled");
	});

	it("default input", function () {
		cy.get('[data-testid="result"]')
			.children()
			.should("have.length.greaterThan", 4)
			.and("have.length.lessThan", 10);
	});

	it("add to head", function () {
		const testInput = "7";

		cy.get('[data-testid="input"]').type(testInput);
		cy.get(ADD_TO_HEAD).click();

		cy.get('[data-testid="result"]')
			.children()
			.first()
			.find('div[class*="circle_circle"]')
			.first()
			.invoke("text")
			.should("eq", testInput);

		cy.get('[data-testid="result"]')
			.children()
			.first()
			.find('div[class*="circle_circle"]')
			.first()
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/changing/);
			});
		cy.wait(500);

		cy.get('[data-testid="result"]')
			.children()
			.first()
			.find('div[class*="circle_circle"]')
			.invoke("text")
			.should("eq", testInput);

		cy.wait(500);
		cy.get('[data-testid="result"]')
			.children()
			.first()
			.find('div[class*="circle_circle"]')
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/default/);
			});
	});

	it("add to tail", function () {
		const testInput = "5";

		cy.get('[data-testid="input"]').type(testInput);
		cy.get(ADD_TO_TAIL).click();

		cy.get('[data-testid="result"]')
			.children()
			.last()
			.find('div[class*="circle_circle"]')
			.last()
			.invoke("text")
			.should("eq", testInput);

		cy.get('[data-testid="result"]')
			.children()
			.last()
			.find('div[class*="circle_circle"]')
			.last()
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/changing/);
			});
		cy.wait(500);

		cy.get('[data-testid="result"]')
			.children()
			.last()
			.find('div[class*="circle_circle"]')
			.invoke("text")
			.should("eq", testInput);

		cy.wait(500);
		cy.get('[data-testid="result"]')
			.children()
			.last()
			.find('div[class*="circle_circle"]')
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/default/);
			});
	});

	it("add by index", function () {
		const testInput = "5";
		const testIdxInput = 1;

		cy.get('[data-testid="input"]').type(testInput);
		cy.get(INDEX).eq(0).type(testIdxInput);
		cy.get(ADD_BY_INDEX).click();

		cy.get('[data-testid="result"]')
			.children()
			.first()
			.find('div[class*="circle_circle"]')
			.first()
			.invoke("text")
			.should("eq", testInput);

		cy.get('[data-testid="result"]')
			.children()
			.first()
			.find('div[class*="circle_circle"]')
			.first()
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/changing/);
			});
		cy.wait(500);

		cy.get('[data-testid="result"]')
			.children()
			.find('div[class*="circle_circle"]')
			.each(($el, index) => {
				if (index === testIdxInput) {
					cy.wrap($el).invoke("text").should("eq", testInput);
					cy.wrap($el)
						.invoke("attr", "class")
						.then((className) => {
							expect(className).to.match(/changing/);
						});
				}
			});
		cy.wait(500);

		cy.get('[data-testid="result"]')
			.children()
			.find('div[class*="circle_circle"]')
			.each(($el, index) => {
				if (index === testIdxInput) {
					cy.wrap($el).invoke("text").should("eq", testInput);
					cy.wrap($el)
						.invoke("attr", "class")
						.then((className) => {
							expect(className).to.match(/modified/);
						});
				}
			});
		cy.wait(500);

		cy.get('[data-testid="result"]')
			.children()
			.find('div[class*="circle_circle"]')
			.each(($el, index) => {
				if (index === testIdxInput) {
					cy.wrap($el).invoke("text").should("eq", testInput);
					cy.wrap($el)
						.invoke("attr", "class")
						.then((className) => {
							expect(className).to.match(/default/);
						});
				}
			});
	});

	it("delete from head", function () {
		cy.get(DELETE_FROM_HEAD).click();

		cy.get('[data-testid="result"]')
			.children()
			.first()
			.find('div[class*="circle_circle"]')
			.first()
			.invoke("text")
			.should("eq", "");

		cy.get('[data-testid="result"]')
			.children()
			.first()
			.find('div[class*="circle_circle"]')
			.last()
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/changing/);
			});
	});

	it("check delete-from-tail animation", function () {
		cy.get(DELETE_FROM_TAIL).click();

		cy.get('[data-testid="result"]')
			.children()
			.last()
			.find('div[class*="circle_circle"]')
			.first()
			.invoke("text")
			.should("eq", "");

		cy.get('[data-testid="result"]')
			.children()
			.last()
			.find('div[class*="circle_circle"]')
			.last()
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/changing/);
			});
	});

	it("delete by index", function () {
		const testIdxInput = 1;

		cy.get(INDEX).eq(0).type(testIdxInput);
		cy.get(DELETE_BY_INDEX).click();

		cy.wait(500);

		cy.get('[data-testid="result"]')
			.children()
			.first()
			.find('div[class*="circle_circle"]')
			.first()
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/changing/);
			});
		cy.wait(500);

		cy.get('[data-testid="result"]')
			.children()
			.find('div[class*="circle_circle"]')
			.each(($el, index) => {
				if (index === testIdxInput) {
					cy.wrap($el)
						.invoke("attr", "class")
						.then((className) => {
							expect(className).to.match(/changing/);
						});
					cy.wrap($el).invoke("text").should("eq", "");
				}
			});
	});
});
