import { Module } from '@nestjs/common';
import { HangmanModule } from './hangman/hangman.module';

@Module({
  imports: [HangmanModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
