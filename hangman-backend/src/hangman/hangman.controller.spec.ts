import { Test, TestingModule } from "@nestjs/testing";
import { HangmanController } from "./hangman.controller";
import { HangmanService } from "./hangman.service";

describe("HangmanController", () => {
  let controller: HangmanController;
  let service: HangmanService;

  const mockHangmanService = {
    createGame: jest.fn((difficulty: "easy" | "medium" | "hard") => ({
      id: "some-random-id",
      word: "gato",
      guessedLetters: [],
      attempts: 0,
      maxAttempts: 6,
      isFinished: false,
      hasWon: false,
    })),
    guessLetter: jest.fn((id: string, letter: string) => ({
      id,
      word: "gato",
      guessedLetters: [letter],
      attempts: letter === "a" ? 0 : 1,
      maxAttempts: 6,
      isFinished: false,
      hasWon: false,
    })),
    guessWord: jest.fn((id: string, word: string) => ({
      id,
      word: "gato",
      guessedLetters: [],
      attempts: word === "gato" ? 0 : 1,
      maxAttempts: 6,
      isFinished: word === "gato",
      hasWon: word === "gato",
    })),
    findGame: jest.fn((id: string) => ({
      id,
      word: "gato",
      guessedLetters: [],
      attempts: 0,
      maxAttempts: 6,
      isFinished: false,
      hasWon: false,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HangmanController],
      providers: [
        {
          provide: HangmanService,
          useValue: mockHangmanService,
        },
      ],
    }).compile();

    controller = module.get<HangmanController>(HangmanController);
    service = module.get<HangmanService>(HangmanService);
  });

  it("debe estar definido", () => {
    expect(controller).toBeDefined();
  });

  it("debe crear un nuevo juego con dificultad válida", () => {
    const result = controller.createGame("easy");
    expect(result).toEqual({
      id: expect.any(String),
      word: "gato",
      guessedLetters: [],
      attempts: 0,
      maxAttempts: 6,
      isFinished: false,
      hasWon: false,
    });
    expect(service.createGame).toHaveBeenCalledWith("easy");
  });

  it("debe manejar una adivinanza de letra correcta", () => {
    const result = controller.guessLetter("some-random-id", "a");
    expect(result).toEqual({
      id: "some-random-id",
      word: "gato",
      guessedLetters: ["a"],
      attempts: 0,
      maxAttempts: 6,
      isFinished: false,
      hasWon: false,
    });
    expect(service.guessLetter).toHaveBeenCalledWith("some-random-id", "a");
  });

  it("debe manejar una adivinanza de letra incorrecta", () => {
    const result = controller.guessLetter("some-random-id", "z"); // Suponemos que 'z' no está en la palabra
    expect(result).toEqual({
      id: "some-random-id",
      word: "gato",
      guessedLetters: ["z"],
      attempts: 1,
      maxAttempts: 6,
      isFinished: false,
      hasWon: false,
    });
    expect(service.guessLetter).toHaveBeenCalledWith("some-random-id", "z");
  });

  it("debe manejar la finalización del juego al adivinar la palabra correcta", () => {
    const result = controller.guessWord("some-random-id", "gato");
    expect(result).toEqual({
      id: "some-random-id",
      word: "gato",
      guessedLetters: [],
      attempts: 0,
      maxAttempts: 6,
      isFinished: true,
      hasWon: true,
    });
    expect(service.guessWord).toHaveBeenCalledWith("some-random-id", "gato");
  });

  it("debe devolver el estado del juego correctamente", () => {
    const result = controller.getGame("some-random-id");
    expect(result).toEqual({
      id: "some-random-id",
      word: "gato",
      guessedLetters: [],
      attempts: 0,
      maxAttempts: 6,
      isFinished: false,
      hasWon: false,
    });
    expect(service.findGame).toHaveBeenCalledWith("some-random-id");
  });

  it("debe lanzar un error al intentar adivinar una letra después de que el juego ha terminado", () => {
    mockHangmanService.guessLetter.mockImplementationOnce(() => {
      throw new Error("Juego no encontrado o ya finalizado");
    });

    expect(() => controller.guessLetter("some-random-id", "a")).toThrow(
      "Juego no encontrado o ya finalizado"
    );
  });

  it("debe lanzar un error al intentar adivinar una palabra después de que el juego ha terminado", () => {
    mockHangmanService.guessWord.mockImplementationOnce(() => {
      throw new Error("Juego no encontrado o ya finalizado");
    });

    expect(() => controller.guessWord("some-random-id", "gato")).toThrow(
      "Juego no encontrado o ya finalizado"
    );
  });

  it("debe devolver el estado de un juego finalizado correctamente", () => {
    mockHangmanService.findGame.mockReturnValue({
      id: "some-random-id",
      word: "gato",
      guessedLetters: ["g", "a", "t", "o"],
      attempts: 0,
      maxAttempts: 6,
      isFinished: true,
      hasWon: true,
    });

    const result = controller.getGame("some-random-id");
    expect(result).toEqual({
      id: "some-random-id",
      word: "gato",
      guessedLetters: ["g", "a", "t", "o"],
      attempts: 0,
      maxAttempts: 6,
      isFinished: true,
      hasWon: true,
    });
    expect(service.findGame).toHaveBeenCalledWith("some-random-id");
  });
});
