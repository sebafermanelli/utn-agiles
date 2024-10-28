import { Module } from '@nestjs/common';
import { HangmanService } from './hangman.service';
import { HangmanController } from './hangman.controller';

@Module({
  controllers: [HangmanController],
  providers: [HangmanService],
})
export class HangmanModule {}
