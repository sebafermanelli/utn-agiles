import { Routes } from '@angular/router';
import { HangmanComponent } from './components/hangman/hangman.component';

export const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: 'game', component: HangmanComponent },
  { path: 'game/:id', component: HangmanComponent },
];
