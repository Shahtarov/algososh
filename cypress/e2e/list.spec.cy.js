import {
	RESULT,
	INPUT,
	INDEX,
	ADD_TO_HEAD,
	ADD_TO_TAIL,
	ADD_BY_INDEX,
	DELETE_FROM_HEAD,
	DELETE_FROM_TAIL,
	DELETE_BY_INDEX,
	findCircle
} from "../../src/constants/constants";

describe("List component", function () {
	beforeEach(function () {
		cy.visit("list");
	});

	it("buttons disabled", function () {
		cy.get(ADD_TO_HEAD).should("be.disabled");
		cy.get(ADD_TO_TAIL).should("be.disabled");
		cy.get(ADD_BY_INDEX).should("be.disabled");
		cy.get(DELETE_BY_INDEX).should("be.disabled");

		cy.get(INPUT).type(1234);
		cy.get(ADD_TO_HEAD).should("not.be.disabled");
		cy.get(ADD_TO_TAIL).should("not.be.disabled");

		cy.get(INDEX).eq(0).type(1);
		cy.get(ADD_BY_INDEX).should("not.be.disabled");
		cy.get(DELETE_BY_INDEX).should("not.be.disabled");
	});

	it("default input", function () {
		cy.get(RESULT)
			.children()
			.should("have.length.greaterThan", 4)
			.and("have.length.lessThan", 10);
	});

	it("add to head", function () {
		const testInput = "7";

		cy.get(INPUT).type(testInput);
		cy.get(ADD_TO_HEAD).click();

		cy.get(RESULT)
			.children()
			.first()
			.find(findCircle)
			.first()
			.invoke("text")
			.should("eq", testInput);

		cy.get(RESULT)
			.children()
			.first()
			.find(findCircle)
			.first()
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/changing/);
			});
		cy.wait(500);

		cy.get(RESULT)
			.children()
			.first()
			.find(findCircle)
			.invoke("text")
			.should("eq", testInput);

		cy.wait(500);
		cy.get(RESULT)
			.children()
			.first()
			.find(findCircle)
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/default/);
			});
	});

	it("add to tail", function () {
		const testInput = "5";

		cy.get(INPUT).type(testInput);
		cy.get(ADD_TO_TAIL).click();

		cy.get(RESULT)
			.children()
			.last()
			.find(findCircle)
			.last()
			.invoke("text")
			.should("eq", testInput);

		cy.get(RESULT)
			.children()
			.last()
			.find(findCircle)
			.last()
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/changing/);
			});
		cy.wait(500);

		cy.get(RESULT)
			.children()
			.last()
			.find(findCircle)
			.invoke("text")
			.should("eq", testInput);

		cy.wait(500);
		cy.get(RESULT)
			.children()
			.last()
			.find(findCircle)
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/default/);
			});
	});

	it("add by index", function () {
		const testInput = "5";
		const testIdxInput = 1;

		cy.get(INPUT).type(testInput);
		cy.get(INDEX).eq(0).type(testIdxInput);
		cy.get(ADD_BY_INDEX).click();

		cy.get(RESULT)
			.children()
			.first()
			.find(findCircle)
			.first()
			.invoke("text")
			.should("eq", testInput);

		cy.get(RESULT)
			.children()
			.first()
			.find(findCircle)
			.first()
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/changing/);
			});
		cy.wait(500);

		cy.get(RESULT)
			.children()
			.find(findCircle)
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

		cy.get(RESULT)
			.children()
			.find(findCircle)
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

		cy.get(RESULT)
			.children()
			.find(findCircle)
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

		cy.get(RESULT)
			.children()
			.first()
			.find(findCircle)
			.first()
			.invoke("text")
			.should("eq", "");

		cy.get(RESULT)
			.children()
			.first()
			.find(findCircle)
			.last()
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/changing/);
			});
	});

	it("check delete-from-tail animation", function () {
		cy.get(DELETE_FROM_TAIL).click();

		cy.get(RESULT)
			.children()
			.last()
			.find(findCircle)
			.first()
			.invoke("text")
			.should("eq", "");

		cy.get(RESULT)
			.children()
			.last()
			.find(findCircle)
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

		cy.get(RESULT)
			.children()
			.first()
			.find(findCircle)
			.first()
			.invoke("attr", "class")
			.then((className) => {
				expect(className).to.match(/changing/);
			});
		cy.wait(500);

		cy.get(RESULT)
			.children()
			.find(findCircle)
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
