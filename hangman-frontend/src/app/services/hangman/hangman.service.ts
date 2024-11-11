import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Hangman {
  id: string;
  word: string;
  guessedWord: string;
  guessedLetters: string[];
  attempts: number;
  maxAttempts: number;
  isFinished: boolean;
  hasWon: boolean;
}

@Injectable({
  providedIn: "root",
})
export class HangmanService {
  private apiUrl = "https://utn-agiles-tp-20n6.onrender.com/hangman";
  // private apiUrl = "http://localhost:3000/hangman";

  constructor(private http: HttpClient) {}

  createGame(difficulty: string): Observable<Hangman> {
    return this.http.post<Hangman>(`${this.apiUrl}/new`, { difficulty });
  }

  guessLetter(gameId: string, letter: string): Observable<Hangman> {
    return this.http.patch<Hangman>(`${this.apiUrl}/guess-letter/${gameId}`, {
      letter,
    });
  }

  guessWord(gameId: string, word: string): Observable<Hangman> {
    return this.http.patch<Hangman>(`${this.apiUrl}/guess-word/${gameId}`, {
      word,
    });
  }

  getGameStatus(gameId: string): Observable<Hangman> {
    return this.http.get<Hangman>(`${this.apiUrl}/${gameId}`);
  }
}
