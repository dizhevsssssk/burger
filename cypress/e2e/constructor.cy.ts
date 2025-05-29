import { setCookie } from "../../src/utils/cookie";

describe("Конструктор бургеров — E2E-тесты с моками", () => {
  const baseUrl = "http://localhost:5000";
  const apiHost = "https://norma.nomoreparties.space";

  /** Настройка моков и токенов перед каждым тестом */
  beforeEach(() => {
    cy.intercept(
      "GET",
      `${apiHost}/api/ingredients`,
      { fixture: "ingredients.json" }
    ).as("ingredients");

    cy.intercept(
      "GET",
      `${apiHost}/api/auth/user`,
      { fixture: "user.json" }
    ).as("user");

    cy.intercept(
      "POST",
      `${apiHost}/api/orders`,
      { fixture: "order.json" }
    ).as("order");

    cy.window().then((win) => {
      setCookie("accessToken", "test-access-token");
      win.localStorage.setItem("refreshToken", "test-refresh-token");
    });

    cy.visit(baseUrl);
  });

  /* ---------- ЗАГРУЗКА ДАННЫХ ---------- */
  context("Загрузка списка ингредиентов", () => {
    it("должен отобразить ровно 3 ингредиента из фикстуры", () => {
      cy.wait("@ingredients"); // убеждаемся, что мок сработал
      cy.get("[data-cy=ingredient]").should("have.length", 3);

      [
        "Флюоресцентная булка R2-D3",
        "Биокотлета из марсианской Магнолии",
        "Соус фирменный Space Sauce",
      ].forEach((title) => {
        cy.contains(title).scrollIntoView().should("be.visible");
      });
    });
  });

    /* ---------- СБОР БУРГЕРА ---------- */
    it('сборка бургера', () => {
            cy.get('button').filter(':contains("Добавить")').eq(0).click({ force: true })
            cy.get('[data-cy=constructor]').contains('Флюоресцентная булка R2-D3').should('be.visible');
            cy.get('button').filter(':contains("Добавить")').eq(1).click({ force: true })
            cy.get('[data-cy=constructor]').contains('Биокотлета из марсианской Магнолии').should('be.visible');
            cy.get('button').filter(':contains("Добавить")').eq(2).click({ force: true })
            cy.get('[data-cy=constructor]').contains('Соус фирменный Space Sauce').should('be.visible');
            cy.get('button').filter(':contains("Добавить")').eq(1).click({ force: true })
            cy.get('[data-cy=constructor]').find('li').should('have.length', 3)
        });

  /* ---------- МОДАЛЬНОЕ ОКНО ИНГРЕДИЕНТА ---------- */
  context("Модальное окно ингредиента", () => {
    beforeEach(() => {
      cy.contains("Флюоресцентная булка R2-D3").click();
      cy.contains("Детали ингредиента").should("be.visible");
    });

    it("закрывается по кнопке-крестику", () => {
      cy.get('[data-cy="modal-closeButton"]').click();
      cy.contains("Детали ингредиента").should("not.exist");
    });

    it("закрывается по клику на оверлей", () => {
      cy.get("[data-cy=modal-overlay]").click("left", { force: true });
      cy.contains("Детали ингредиента").should("not.exist");
    });
  });

  /* ---------- СОЗДАНИЕ ЗАКАЗА ---------- */
  context("Оформление заказа", () => {
    it("оформляет заказ и очищает конструктор", () => {
      cy.get("button:contains('Добавить')").first().click({ force: true }); // булка

      cy.get("button:contains('Оформить заказ')").first().click({ force: true });
      cy.wait("@order");

      cy.contains("Ваш заказ начали готовить").should("be.visible");
      cy.contains("74306").should("be.visible"); // номер из order.json

      cy.get('[data-cy="modal-closeButton"]').click();
      cy.contains("Ваш заказ начали готовить").should("not.exist");

      cy.contains("Выберите булки").should("be.visible");
      cy.contains("Выберите начинку").should("be.visible");
    });
  });
});
