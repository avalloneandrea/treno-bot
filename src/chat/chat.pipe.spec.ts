import { Test, TestingModule } from '@nestjs/testing';

import { ChatPipe } from './chat.pipe';
import { Status } from '../domain/status.dto';

describe('ChatPipe', () => {

  let pipe: ChatPipe;

  beforeEach(async () => {
    const fixture: TestingModule = await Test.createTestingModule({
      providers: [ ChatPipe ]
    }).compile();
    pipe = fixture.get(ChatPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should transform a value for an invalid train', () => {
    const status: Status = { ok: false };
    expect(pipe.transform(status)).toContain('Treno non trovato');
  });

  it('should transform a value for an ongoing train', () => {
    const status: Status = {
      ok: true,
      compNumeroTreno: 'REG 72415',
      origine: 'NAPOLI CENTRALE',
      destinazione: 'SAPRI',
      compOrarioPartenza: '18:17',
      provvedimento: 0,
      compRitardoAndamento: [ 'in orario' ]
    };
    expect(pipe.transform(status)).toContain('Il treno REG 72415');
    expect(pipe.transform(status)).toContain('proveniente da Napoli Centrale');
    expect(pipe.transform(status)).toContain('diretto a Sapri');
    expect(pipe.transform(status)).toContain('delle ore 18:17');
    expect(pipe.transform(status)).toContain('viaggia in orario');
  });

  it('should transform a value for a canceled train', () => {
    const status: Status = {
      ok: true,
      compNumeroTreno: 'REG 72415',
      origine: 'NAPOLI CENTRALE',
      destinazione: 'SAPRI',
      compOrarioPartenza: '18:17',
      provvedimento: 1,
      compRitardoAndamento: [ 'in orario' ]
    };
    expect(pipe.transform(status)).toContain('Il treno REG 72415');
    expect(pipe.transform(status)).toContain('proveniente da Napoli Centrale');
    expect(pipe.transform(status)).toContain('diretto a Sapri');
    expect(pipe.transform(status)).toContain('delle ore 18:17');
    expect(pipe.transform(status)).toContain('è stato cancellato');
  });

  it('should provide help message', () => {
    expect(pipe.help().pretext).toContain('Hai bisogno di aiuto con Treno');
    expect(pipe.help().text).toContain('Digita il numero di un treno in un messaggio diretto');
    expect(pipe.help().text).toContain('ti invierò informazioni in tempo reale circa il suo andamento');
  });

});
