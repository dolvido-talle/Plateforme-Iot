describe("Login Page Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the login form", () => {
    // Vérifie que les éléments du formulaire sont visibles
    cy.contains("h4", "Connexion").should("be.visible");
    cy.get("input[name='email']").should("be.visible");
    cy.get("input[name='password']").should("be.visible");
    cy.get("button[type='submit']").should("be.visible");

    // Remplir le formulaire avec des identifiants incorrects
    cy.get("input[name='email']").type("admin3il@3il.fr");
    cy.get("input[name='password']").type("admin3il");
    cy.get("button[type='submit']").click();
    cy.wait(3000)
    cy.contains("h2", "Liste des Devices").should("be.visible");

  });

  // it("should display the login form", () => {
  //   cy.contains("h4", "Connexion").should("be.visible");
  //   cy.get("input[label='Email']").should("be.visible");
  //   cy.get("input[label='Mot de passe']").should("be.visible");
  //   cy.get("button[type='submit']").should("be.visible");
  // });

  // it("should show an error message for incorrect credentials", () => {
  //   cy.intercept("POST", "/api/login", {
  //     statusCode: 401,
  //     body: { detail: "Identifiants incorrects !" },
  //   }).as("loginRequest");

  //   cy.get("input[label='Email']").type("incorrect@example.com");
  //   cy.get("input[label='Mot de passe']").type("wrongpassword");
  //   cy.get("button[type='submit']").click();

  //   cy.wait("@loginRequest");

  //   cy.contains("Identifiants incorrects !").should("be.visible");
  // });

  // it("should login successfully with correct credentials", () => {
  //   cy.intercept("POST", "/api/login", {
  //     statusCode: 200,
  //     body: {
  //       access: "fakeAccessToken",
  //       refresh: "fakeRefreshToken",
  //     },
  //   }).as("loginRequest");

  //   cy.get("input[label='Email']").type("correct@example.com");
  //   cy.get("input[label='Mot de passe']").type("correctpassword");
  //   cy.get("button[type='submit']").click();

  //   cy.wait("@loginRequest");

  //   cy.url().should("eq", Cypress.config().baseUrl + "/");
  //});
});
