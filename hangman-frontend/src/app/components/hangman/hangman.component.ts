import { Component, OnInit } from '@angular/core';
import {
  Hangman,
  HangmanService,
} from '../../services/hangman/hangman.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hangman',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hangman.component.html',
})
export class HangmanComponent implements OnInit {
  gameId: string | null = null;
  gameStatus: Hangman | null = null;
  letterGuess: string = '';
  wordGuess: string = '';
  difficulty: string = 'easy';
  difficultyOptions: string[] = ['easy', 'medium', 'hard'];
  selectedDifficulty: string = 'easy';
  gameStarted: boolean = false;

  constructor(
    private hangmanService: HangmanService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.gameId = params.get('id');
      if (this.gameId) {
        this.hangmanService.getGameStatus(this.gameId).subscribe(
          (status: Hangman) => {
            this.gameStatus = status;
            this.gameStarted = true;
          },
          (error) => {
            console.error('Error fetching game status:', error);
            this.router.navigate(['/game']);
          }
        );
      } else {
        this.gameStarted = false;
      }
    });
  }

  startNewGame(): void {
    this.gameStarted = true;
    this.hangmanService
      .createGame(this.selectedDifficulty)
      .subscribe((game: Hangman) => {
        this.gameId = game.id;
        this.router.navigate(['/game', this.gameId]);
        this.gameStatus = game;
      });
  }

  getGameStatus(): void {
    if (this.gameId) {
      this.hangmanService
        .getGameStatus(this.gameId)
        .subscribe((status: Hangman) => {
          this.gameStatus = status;
        });
    }
  }

  get wordArray(): string[] {
    return this.gameStatus?.word?.split('') || [];
  }

  get isValidLetterGuess(): boolean {
    return this.letterGuess.length === 1;
  }

  get isValidWordGuess(): boolean {
    return this.wordGuess.length > 0;
  }

  onLetterKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.isValidLetterGuess) {
      this.guessLetter();
    }
  }

  onWordKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.isValidWordGuess) {
      this.guessWord();
    }
  }

  guessLetter(): void {
    if (this.gameId && this.letterGuess) {
      this.hangmanService
        .guessLetter(this.gameId, this.letterGuess)
        .subscribe((status: Hangman) => {
          this.gameStatus = status;
          this.letterGuess = '';
        });
    }
  }

  guessWord(): void {
    if (this.gameId && this.wordGuess) {
      this.hangmanService
        .guessWord(this.gameId, this.wordGuess)
        .subscribe((status: Hangman) => {
          this.gameStatus = status;
          this.wordGuess = '';
        });
    }
  }
}
