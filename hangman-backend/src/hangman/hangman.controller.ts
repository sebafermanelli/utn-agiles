import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { HangmanService } from './hangman.service';

@Controller('hangman')
export class HangmanController {
  constructor(private readonly hangmanService: HangmanService) {}

  @Post('new')
  createGame(@Body('difficulty') difficulty: 'easy' | 'medium' | 'hard') {
    try {
      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        throw new BadRequestException('Dificultad invalida');
      }
      return this.hangmanService.createGame(difficulty);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('guess-letter/:id')
  guessLetter(@Param('id') id: string, @Body('letter') letter: string) {
    try {
      if (letter.length !== 1) {
        throw new BadRequestException('Debe ingresar una sola letra');
      }
      return this.hangmanService.guessLetter(id, letter);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('guess-word/:id')
  guessWord(@Param('id') id: string, @Body('word') word: string) {
    try {
      if (word.length < 1) {
        throw new BadRequestException('Debe ingresar una palabra');
      }
      return this.hangmanService.guessWord(id, word);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  getGame(@Param('id') id: string) {
    try {
      return this.hangmanService.findGame(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
