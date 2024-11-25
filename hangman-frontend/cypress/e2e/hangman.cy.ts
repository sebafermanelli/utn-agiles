describe("Hangman Game", () => {
  beforeEach(() => {
    cy.visit("https://utn-agiles-tp.vercel.app/game");
  });

  it("should start a new game with selected difficulty", () => {
    // Select difficulty
    cy.get("select").select("easy");

    // Start game
    cy.contains("button", "Iniciar Juego").click();

    // Verify game started
    cy.get('input[placeholder="Adivina una letra"]').should("exist");
    cy.get('input[placeholder="Adivina la palabra"]').should("exist");
  });

  it("should allow guessing letters", () => {
    // Start game
    cy.get("select").select("easy");
    cy.contains("button", "Iniciar Juego").click();

    // Guess a letter
    cy.get('input[placeholder="Adivina una letra"]').type("a");
    cy.contains("button", "Adivinar Letra").click();

    // Verify attempt was registered
    cy.contains("Intentos:").should("exist");
  });

  it("should allow guessing words", () => {
    // Start game
    cy.get("select").select("easy");
    cy.contains("button", "Iniciar Juego").click();

    // Guess a word
    cy.get('input[placeholder="Adivina la palabra"]').type("gato");
    cy.contains("button", "Adivinar Palabra").click();

    // Verify attempt was registered
    cy.contains("Intentos:").should("exist");
  });

  it("should show game over when max attempts reached", () => {
    // Start game
    cy.get("select").select("easy");
    cy.contains("button", "Iniciar Juego").click();

    // Make 6 wrong guesses
    for (let i = 0; i < 6; i++) {
      cy.get('input[placeholder="Adivina una letra"]').clear().type("z");
      cy.contains("button", "Adivinar Letra").should("not.be.disabled").click();
      cy.wait(1000);
    }

    // Verify game over state
    cy.contains("Has Perdido").should("exist");
    cy.contains("Empezar Nuevo Juego").should("exist");
  });

  it("should show victory when word is guessed correctly", () => {
    // Start game
    cy.get("select").select("easy");
    cy.contains("button", "Iniciar Juego").click();

    // Obtener la palabra del atributo data-test-word
    cy.get("[data-test-word]")
      .invoke("attr", "data-test-word")
      .then((word) => {
        if (word) {
          cy.get('input[placeholder="Adivina la palabra"]').clear().type(word);
          cy.contains("button", "Adivinar Palabra")
            .should("not.be.disabled")
            .click();

          // Verify victory state
          cy.contains("¡Has Ganado!").should("exist");
          cy.contains("Empezar Nuevo Juego").should("exist");
        }
      });
  });

  it("should show game state updates when guessing word", () => {
    // Start game
    cy.get("select").select("easy");
    cy.contains("button", "Iniciar Juego").click();

    // Intentar adivinar una palabra
    cy.get('input[placeholder="Adivina la palabra"]').clear().type("cualquier");

    cy.contains("button", "Adivinar Palabra").should("not.be.disabled").click();
    // Verificar que el juego responde (ya sea con victoria o derrota)
    cy.get("body").should("satisfy", ($body: JQuery<HTMLElement>) => {
      return (
        $body.text().includes("¡Has Ganado!") ||
        $body.text().includes("Intentos:")
      );
    });
  });
});
