import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('HangmanController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('debe crear un nuevo juego con dificultad válida (POST /hangman/new)', () => {
    return request(app.getHttpServer())
      .post('/hangman/new')
      .send({ difficulty: 'easy' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('word');
        expect(res.body.guessedLetters).toEqual([]);
        expect(res.body.attempts).toBe(0);
        expect(res.body.maxAttempts).toBe(6);
        expect(res.body.isFinished).toBe(false); // Juego no debe estar terminado al inicio
        expect(res.body.hasWon).toBe(false); // El jugador no ha ganado al inicio
      });
  });

  it('debe lanzar un error al crear un juego con dificultad inválida (POST /hangman/new)', () => {
    return request(app.getHttpServer())
      .post('/hangman/new')
      .send({ difficulty: 'invalid' })
      .expect(400);
  });

  it('debe adivinar una letra correctamente (PATCH /hangman/guess-letter/:id)', async () => {
    // Primero crea un nuevo juego
    const response = await request(app.getHttpServer())
      .post('/hangman/new')
      .send({ difficulty: 'easy' });

    const gameId = response.body.id;

    // Ahora adivina una letra correcta
    return request(app.getHttpServer())
      .patch(`/hangman/guess-letter/${gameId}`)
      .send({ letter: 'a' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', gameId);
        expect(res.body.guessedLetters).toContain('a');
        expect(res.body.attempts).toBe(0); // No debe aumentar intentos si es correcta
        expect(res.body.isFinished).toBe(false); // Juego no debe estar terminado
        expect(res.body.hasWon).toBe(false); // El jugador no ha ganado
      });
  });

  it('debe adivinar una palabra incorrectamente (PATCH /hangman/guess-word/:id)', async () => {
    // Primero crea un nuevo juego
    const response = await request(app.getHttpServer())
      .post('/hangman/new')
      .send({ difficulty: 'easy' });

    const gameId = response.body.id;

    // Ahora adivina una palabra incorrecta
    return request(app.getHttpServer())
      .patch(`/hangman/guess-word/${gameId}`)
      .send({ word: 'incorrecta' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', gameId);
        expect(res.body.attempts).toBe(1); // Debe aumentar intentos si es incorrecta
        expect(res.body.isFinished).toBe(false); // Juego no debe estar terminado
        expect(res.body.hasWon).toBe(false); // El jugador no ha ganado
      });
  });

  it('debe finalizar el juego al adivinar la palabra completa correctamente (PATCH /hangman/guess-word/:id)', async () => {
    // Primero crea un nuevo juego
    const response = await request(app.getHttpServer())
      .post('/hangman/new')
      .send({ difficulty: 'easy' });

    const gameId = response.body.id;

    // Ahora adivina la palabra completa correctamente
    return request(app.getHttpServer())
      .patch(`/hangman/guess-word/${gameId}`)
      .send({ word: response.body.word })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', gameId);
        expect(res.body.isFinished).toBe(true); // El juego debe estar finalizado
        expect(res.body.hasWon).toBe(true); // El jugador debe haber ganado
      });
  });

  it('debe finalizar el juego al alcanzar el número máximo de intentos incorrectos (PATCH /hangman/guess-letter/:id)', async () => {
    // Primero crea un nuevo juego
    const response = await request(app.getHttpServer())
      .post('/hangman/new')
      .send({ difficulty: 'easy' });

    const gameId = response.body.id;

    // Adivinar letras incorrectas hasta agotar los intentos
    for (let i = 0; i < 6; i++) {
      await request(app.getHttpServer())
        .patch(`/hangman/guess-letter/${gameId}`)
        .send({ letter: 'z' }) // Suponiendo que 'z' no está en la palabra
        .expect(200);
    }

    // Verifica que el juego haya terminado después de 6 intentos incorrectos
    return request(app.getHttpServer())
      .get(`/hangman/${gameId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.isFinished).toBe(true); // El juego debe estar finalizado
        expect(res.body.hasWon).toBe(false); // El jugador no debe haber ganado
      });
  });

  it('debe obtener el estado del juego correctamente (GET /hangman/:id)', async () => {
    // Primero crea un nuevo juego
    const response = await request(app.getHttpServer())
      .post('/hangman/new')
      .send({ difficulty: 'easy' });

    const gameId = response.body.id;

    // Ahora obten el estado del juego
    return request(app.getHttpServer())
      .get(`/hangman/${gameId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', gameId);
        expect(res.body).toHaveProperty('word');
        expect(res.body.guessedLetters).toEqual([]);
        expect(res.body.attempts).toBe(0);
        expect(res.body.maxAttempts).toBe(6);
        expect(res.body.isFinished).toBe(false); // Juego no debe estar terminado
        expect(res.body.hasWon).toBe(false); // El jugador no debe haber ganado
      });
  });
});
