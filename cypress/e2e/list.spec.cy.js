import {
	elStateColors,
	testCircleArr,
	testCircleSmall
} from "../../src/constants/constants";
import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";

describe("Связный список: проверка компонентов", function () {
	beforeEach(function () {
		cy.visit("http://localhost:3000/list");
		cy.contains("Добавить в head").as("btnAddHead");
		cy.contains("Добавить в tail").as("btnAddTail");
		cy.contains("Удалить из head").as("btnDeleteHead");
		cy.contains("Удалить из tail").as("btnDeleteTail");
		cy.contains("Добавить по индексу").as("btnAddIndex");
		cy.contains("Удалить по индексу").as("btnDeleteIndex");
		cy.get('input[name="inputValue"]').as("inputValue");
		cy.get('input[name="inputIndex"]').as("inputIndex");
	});

	it("Если в инпуте пусто, то кнопки добавления и кнопка удаления по индексу недоступны", function () {
		cy.contains("Связный список");
		cy.get("@inputValue").should("be.empty");
		cy.get("@btnAddHead").should("be.disabled");
		cy.get("@btnAddTail").should("be.disabled");
		cy.get("@btnAddIndex").should("be.disabled");

		cy.get("@inputIndex").should("be.empty");
		cy.get("@btnAddIndex").should("be.disabled");
		cy.get("@btnDeleteIndex").should("be.disabled");
	});

	it("Корректность отрисовки дефолтного списка", function () {
		cy.get(testCircle)
			.should("have.length.gte", 2)
			.and("have.length.lte", 6)
			.each((value) => {
				cy.wrap(value).should("have.css", "border", elStateColors.default);
			});
		cy.get(testCircle).first().siblings().contains("head");
		cy.get(testCircle).last().siblings().contains("tail");
	});

	it("Корректность добавления элемента в head", function () {
		cy.get("@inputValue").type("5555");
		cy.get("@btnAddHead").click();
		cy.get(testCircleArr)
			.first()
			.find(testCircleSmall)
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(testCircle)
			.first()
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.modified)
			.siblings()
			.contains("head");
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(testCircle)
			.first()
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.default);
	});

	it("Корректность добавления элемента в tail", function () {
		cy.get("@inputValue").type("5555");
		cy.get("@btnAddTail").click();
		cy.get(testCircleArr)
			.last()
			.find(testCircleSmall)
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(testCircle)
			.last()
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.modified)
			.siblings()
			.contains("tail");
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(testCircle)
			.last()
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.default);
	});

	it("Корректность добавления элемента по индексу", function () {
		cy.get("@inputValue").type("indx");
		cy.get("@inputIndex").type("1");
		cy.get("@btnAddIndex").click();

		cy.get(testCircleArr)
			.first()
			.find(testCircleSmall)
			.should("have.text", "indx")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(testCircleArr)
			.eq(1)
			.find(testCircleSmall)
			.should("have.text", "indx")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(testCircle)
			.eq(1)
			.should("have.text", "indx")
			.and("have.css", "border", elStateColors.modified);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(testCircle)
			.eq(1)
			.should("have.text", "indx")
			.and("have.css", "border", elStateColors.default);
	});

	it("Корректность удаления элемента из head", function () {
		cy.get("@inputValue").type("5555");
		cy.get("@btnAddHead").click();
		cy.get("@btnDeleteHead").click();

		cy.get(testCircleArr)
			.first()
			.find(testCircleSmall)
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(testCircleArr).first().should("not.have.text", "5555");
	});

	it("Корректность удаления элемента из tail", function () {
		cy.get("@inputValue").type("5555");
		cy.get("@btnAddTail").click();
		cy.get("@btnDeleteTail").click();

		cy.get(testCircleArr)
			.last()
			.find(testCircleSmall)
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(testCircleArr).last().should("not.have.text", "5555");
	});

	it("Корректность удаления элемента по индексу", function () {
		cy.get("@inputValue").type("indx");
		cy.get("@inputIndex").type("2");
		cy.get("@btnAddIndex").click();

		cy.get("@inputIndex").type("2");
		cy.get("@btnDeleteIndex").click();

		cy.get(testCircle).each((value, index) => {
			index < 2
				? cy
						.wrap(value)
						.should("have.css", "border", elStateColors.changing)
				: cy
						.wrap(value)
						.should("have.css", "border", elStateColors.default);
		});

		cy.wait(SHORT_DELAY_IN_MS);

		cy.get(testCircleArr)
			.eq(2)
			.find(testCircleSmall)
			.should("have.css", "border", elStateColors.changing)
			.and("have.text", "indx");

		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(testCircle)
			.eq(2)
			.should("have.css", "border", elStateColors.default)
			.and("not.have.text", "indx");
	});
});
