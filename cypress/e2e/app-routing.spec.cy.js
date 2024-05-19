describe("Routing is working", function () {
	before(function () {
		cy.visit("http://localhost:3000");
	});

	it("should open main page", function () {
		cy.contains("МБОУ АЛГОСОШ");
	});

	it("should open string page", function () {
		cy.visit("http://localhost:3000/recursion");
		cy.contains("Строка");
	});

	it("should open fibonacci page", function () {
		cy.visit("http://localhost:3000/fibonacci");
		cy.contains("Последовательность Фибоначчи");
	});

	it("should open sort page", function () {
		cy.visit("http://localhost:3000/sorting");
		cy.contains("Сортировка массива");
	});

	it("should open stack page", function () {
		cy.visit("http://localhost:3000/stack");
		cy.contains("Стек");
	});

	it("should open queue page", function () {
		cy.visit("http://localhost:3000/queue");
		cy.contains("Очередь");
	});

	it("should open list page", function () {
		cy.visit("http://localhost:3000/list");
		cy.contains("Связный список");
	});
});
