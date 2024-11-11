export class Hangman {
  id: string;
  word: string;
  guessedWord: string;
  guessedLetters: string[];
  attempts: number;
  maxAttempts: number;
  isFinished: boolean;
  hasWon: boolean;
}
