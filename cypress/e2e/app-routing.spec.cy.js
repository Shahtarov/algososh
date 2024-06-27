describe("Routing is working", function () {
	before(function () {
		cy.visit("");
	});

	it("should open main page", function () {
		cy.contains("МБОУ АЛГОСОШ");
	});

	it("should open string page", function () {
		cy.visit("recursion");
		cy.contains("Строка");
	});

	it("should open fibonacci page", function () {
		cy.visit("fibonacci");
		cy.contains("Последовательность Фибоначчи");
	});

	it("should open sort page", function () {
		cy.visit("sorting");
		cy.contains("Сортировка массива");
	});

	it("should open stack page", function () {
		cy.visit("stack");
		cy.contains("Стек");
	});

	it("should open queue page", function () {
		cy.visit("queue");
		cy.contains("Очередь");
	});

	it("should open list page", function () {
		cy.visit("list");
		cy.contains("Связный список");
	});
});
