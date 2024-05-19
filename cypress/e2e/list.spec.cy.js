import {
	elStateColors,
	findCircle,
	findCircleArr,
	findCircleSmall
} from "../../src/constants/constants";
import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";

describe("List component", function () {
	beforeEach(function () {
		cy.visit("http://localhost:3000/list");
		cy.contains("Добавить в head").as("btnAddHead");
		cy.contains("Добавить в tail").as("btnAddTail");
		cy.contains("Удалить из head").as("btnDeleteHead");
		cy.contains("Удалить из tail").as("btnDeleteTail");
		cy.contains("Добавить по индексу").as("btnAddIndex");
		cy.contains("Удалить по индексу").as("btnDeleteIndex");
		cy.get('input[name="inputValue"]').as("inputValue");
		cy.get('input[name="inputIdx"]').as("inputIndex");
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
		cy.get(findCircle)
			.should("have.length.gte", 2)
			.and("have.length.lte", 6)
			.each((value) => {
				cy.wrap(value).should("have.css", "border", elStateColors.default);
			});
		cy.get(findCircle).first().siblings().contains("head");
		cy.get(findCircle).last().siblings().contains("tail");
	});

	it("Корректность добавления элемента в head", function () {
		cy.get("@inputValue").type("5555");
		cy.get("@btnAddHead").click();
		cy.get(findCircleArr)
			.first()
			.find(findCircleSmall)
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(findCircle)
			.first()
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.modified)
			.siblings()
			.contains("head");
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(findCircle)
			.first()
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.default);
	});

	it("Корректность добавления элемента в tail", function () {
		cy.get("@inputValue").type("5555");
		cy.get("@btnAddTail").click();
		cy.get(findCircleArr)
			.last()
			.find(findCircleSmall)
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(findCircle)
			.last()
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.modified)
			.siblings()
			.contains("tail");
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(findCircle)
			.last()
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.default);
	});

	it("Корректность добавления элемента по индексу", function () {
		cy.get("@inputValue").type("indx");
		cy.get("@inputIndex").type("1");
		cy.get("@btnAddIndex").click();

		cy.get(findCircleArr)
			.first()
			.find(findCircleSmall)
			.should("have.text", "indx")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(findCircleArr)
			.eq(1)
			.find(findCircleSmall)
			.should("have.text", "indx")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(findCircle)
			.eq(1)
			.should("have.text", "indx")
			.and("have.css", "border", elStateColors.modified);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(findCircle)
			.eq(1)
			.should("have.text", "indx")
			.and("have.css", "border", elStateColors.default);
	});

	it("Корректность удаления элемента из head", function () {
		cy.get("@inputValue").type("5555");
		cy.get("@btnAddHead").click();
		cy.get("@btnDeleteHead").click();

		cy.get(findCircleArr)
			.first()
			.find(findCircleSmall)
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(findCircleArr).first().should("not.have.text", "5555");
	});

	it("Корректность удаления элемента из tail", function () {
		cy.get("@inputValue").type("5555");
		cy.get("@btnAddTail").click();
		cy.get("@btnDeleteTail").click();

		cy.get(findCircleArr)
			.last()
			.find(findCircleSmall)
			.should("have.text", "5555")
			.and("have.css", "border", elStateColors.changing);
		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(findCircleArr).last().should("not.have.text", "5555");
	});

	it("Корректность удаления элемента по индексу", function () {
		cy.get("@inputValue").type("indx");
		cy.get("@inputIndex").type("2");
		cy.get("@btnAddIndex").click();

		cy.get("@inputIndex").type("2");
		cy.get("@btnDeleteIndex").click();

		cy.get(findCircle).each((value, index) => {
			index < 2
				? cy
						.wrap(value)
						.should("have.css", "border", elStateColors.changing)
				: cy
						.wrap(value)
						.should("have.css", "border", elStateColors.default);
		});

		cy.wait(SHORT_DELAY_IN_MS);

		cy.get(findCircleArr)
			.eq(2)
			.find(findCircleSmall)
			.should("have.css", "border", elStateColors.changing)
			.and("have.text", "indx");

		cy.wait(SHORT_DELAY_IN_MS);
		cy.get(findCircle)
			.eq(2)
			.should("have.css", "border", elStateColors.default)
			.and("not.have.text", "indx");
	});
});
