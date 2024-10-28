export class Hangman {
  id: string;
  word: string;
  guessedLetters: string[];
  attempts: number;
  maxAttempts: number;
  isFinished: boolean;
  hasWon: boolean;
}
