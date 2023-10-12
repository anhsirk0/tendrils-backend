import { Test, TestingModule } from '@nestjs/testing';
import { TendrilsService } from './tendrils.service';

describe('TendrilsService', () => {
  let service: TendrilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TendrilsService],
    }).compile();

    service = module.get<TendrilsService>(TendrilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
