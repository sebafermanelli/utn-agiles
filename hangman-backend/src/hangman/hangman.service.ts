import { Injectable } from "@nestjs/common";
import { Hangman } from "./entities/hangman.entity";
import { randomUUID } from "crypto";

@Injectable()
export class HangmanService {
  private games = new Map<string, Hangman>();
  private words = {
    easy: ["gato", "perro", "pajaro", "leon", "tigre"],
    medium: ["cocodrilo", "elefante", "jirafa", "hipopotamo", "rinoceronte"],
    hard: ["ornitorrinco", "murcielago", "iguana", "tarantula", "escarabajo"],
  };

  createGame(
    difficulty: "easy" | "medium" | "hard",
    providedWord?: string
  ): Hangman {
    const word = providedWord ? providedWord : this.getRandomWord(difficulty);
    const id = randomUUID();

    const game: Hangman = {
      id,
      word,
      guessedWord: "_".repeat(word.length),
      guessedLetters: [],
      attempts: 0,
      maxAttempts: 6,
      isFinished: false,
      hasWon: false,
    };

    this.games.set(id, game);
    return game;
  }

  getRandomWord(difficulty: "easy" | "medium" | "hard"): string {
    const words = this.words[difficulty];
    return words[Math.floor(Math.random() * words.length)];
  }

  guessLetter(id: string, letter: string): Hangman {
    const game = this.games.get(id);
    if (!game || game.isFinished) {
      throw new Error("Juego no encontrado o ya finalizado");
    }

    if (!game.word.includes(letter)) {
      game.attempts++;
      if (game.attempts >= game.maxAttempts) {
        game.isFinished = true;
        this.games.delete(id);
      }
    } else {
      game.guessedLetters.push(letter);
      game.guessedWord = game.word
        .split("")
        .map((char) => (game.guessedLetters.includes(char) ? char : "_"))
        .join("");
      if (this.isGameWon(game)) {
        game.isFinished = true;
        game.hasWon = true;
        this.games.delete(id);
      }
    }

    return game;
  }

  guessWord(id: string, word: string): Hangman {
    const game = this.games.get(id);
    if (!game || game.isFinished) {
      throw new Error("Juego no encontrado o ya finalizado");
    }

    if (game.word !== word) {
      game.attempts++;
      if (game.attempts >= game.maxAttempts) {
        game.isFinished = true;
        this.games.delete(id);
      }
    } else {
      game.isFinished = true;
      game.hasWon = true;
      game.guessedWord = word;
      game.guessedLetters = word.split("");
      this.games.delete(id);
    }

    return game;
  }

  findGame(id: string): Hangman {
    const game = this.games.get(id);
    if (!game) {
      throw new Error("Juego no encontrado");
    }
    return game;
  }

  private isGameWon(game: Hangman): boolean {
    return game.word
      .split("")
      .every((letter) => game.guessedLetters.includes(letter));
  }
}
