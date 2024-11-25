import { Test, TestingModule } from "@nestjs/testing";
import { HangmanService } from "./hangman.service";
import { Hangman } from "./entities/hangman.entity";

describe("HangmanService", () => {
  let service: HangmanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HangmanService],
    }).compile();

    service = module.get<HangmanService>(HangmanService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it('debe crear un nuevo juego con dificultad "easy"', () => {
    const game: Hangman = service.createGame("easy");
    expect(game).toBeDefined();
    expect(game.word).toBeDefined();
    expect(game.guessedWord).toBeDefined();
    expect(game.guessedLetters.length).toBe(0);
    expect(game.attempts).toBe(0);
    expect(game.maxAttempts).toBe(6);
  });

  it('debe seleccionar una palabra aleatoria basada en la dificultad "easy"', () => {
    const word = service.getRandomWord("easy");
    expect(["gato", "perro", "pajaro", "leon", "tigre"]).toContain(word);
  });

  it('debe seleccionar una palabra aleatoria basada en la dificultad "medium"', () => {
    const word = service.getRandomWord("medium");
    expect([
      "cocodrilo",
      "elefante",
      "jirafa",
      "hipopotamo",
      "rinoceronte",
    ]).toContain(word);
  });

  it('debe seleccionar una palabra aleatoria basada en la dificultad "hard"', () => {
    const word = service.getRandomWord("hard");
    expect([
      "ornitorrinco",
      "murcielago",
      "iguana",
      "tarantula",
      "escarabajo",
    ]).toContain(word);
  });

  it("debe manejar una adivinanza de letra correcta", () => {
    const game = service.createGame("easy");
    const word = game.word;
    const letter = word.charAt(0); // Usa la primera letra de la palabra
    const updatedGame = service.guessLetter(game.id, letter);
    expect(updatedGame.guessedWord).toContain(letter);
    expect(updatedGame.guessedLetters).toContain(letter);
    expect(updatedGame.attempts).toBe(0); // No debe aumentar intentos si es correcta
  });

  it("debe manejar una adivinanza de letra incorrecta", () => {
    const game = service.createGame("easy");
    const updatedGame = service.guessLetter(game.id, "z"); // Suponemos que 'z' no está en la palabra
    expect(updatedGame.guessedLetters).not.toContain("z");
    expect(updatedGame.attempts).toBe(1); // Debe aumentar intentos
  });

  it("debe manejar una adivinanza de palabra correcta", () => {
    const game = service.createGame("easy");
    const updatedGame = service.guessWord(game.id, game.word); // Adivina la palabra correcta
    expect(updatedGame.attempts).toBe(0); // No debe aumentar intentos
  });

  it("debe manejar una adivinanza de palabra incorrecta", () => {
    const game = service.createGame("easy");
    const updatedGame = service.guessWord(game.id, "incorrecta");
    expect(updatedGame.attempts).toBe(1); // Debe aumentar intentos
  });

  it("debe lanzar un error si el juego no se encuentra al adivinar una letra", () => {
    expect(() => service.guessLetter("invalido", "a")).toThrow(
      "Juego no encontrado o ya finalizadoa"
    );
  });

  it("debe lanzar un error si el juego no se encuentra al adivinar una palabra", () => {
    expect(() => service.guessWord("invalido", "gato")).toThrow(
      "Juego no encontrado o ya finalizado"
    );
  });

  it("debe devolver el estado del juego correctamente", () => {
    const game = service.createGame("easy");
    const foundGame = service.findGame(game.id);
    expect(foundGame).toEqual(game);
  });

  it("debe lanzar un error si se busca un juego inexistente", () => {
    expect(() => service.findGame("invalido")).toThrow("Juego no encontrado");
  });

  it("debe finalizar el juego al adivinar todas las letras correctamente", () => {
    const game = service.createGame("easy");
    const word = game.word;

    // Adivina todas las letras
    for (const letter of new Set(word.split(""))) {
      service.guessLetter(game.id, letter);
    }

    expect(() => service.findGame(game.id)).toThrow("Juego no encontrado");
  });

  it("debe finalizar el juego al adivinar la palabra completa correctamente", () => {
    const game = service.createGame("easy");
    const updatedGame = service.guessWord(game.id, game.word);

    expect(updatedGame.isFinished).toBe(true);
    expect(updatedGame.hasWon).toBe(true);
  });

  it("debe finalizar el juego cuando se alcanza el número máximo de intentos incorrectos", () => {
    const game = service.createGame("easy");

    // Adivina letras incorrectas hasta alcanzar el número máximo de intentos
    for (let i = 0; i < game.maxAttempts; i++) {
      service.guessLetter(game.id, "z"); // Suponemos que 'z' no está en la palabra
    }

    expect(() => service.findGame(game.id)).toThrow("Juego no encontrado");
  });

  it("debe lanzar un error si se intenta adivinar una letra después de que el juego ha terminado", () => {
    const game = service.createGame("easy");

    // Adivina letras incorrectas hasta alcanzar el número máximo de intentos
    for (let i = 0; i < game.maxAttempts; i++) {
      service.guessLetter(game.id, "z");
    }

    // El juego ya debería estar finalizado
    expect(() => service.guessLetter(game.id, "a")).toThrow(
      "Juego no encontrado o ya finalizado"
    );
  });

  it("debe lanzar un error si se intenta adivinar una palabra después de que el juego ha terminado", () => {
    const game = service.createGame("easy");

    // Adivina letras incorrectas hasta alcanzar el número máximo de intentos
    for (let i = 0; i < game.maxAttempts; i++) {
      service.guessLetter(game.id, "z");
    }

    // El juego ya debería estar finalizado
    expect(() => service.guessWord(game.id, "gato")).toThrow(
      "Juego no encontrado o ya finalizado"
    );
  });
});
