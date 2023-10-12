import { Test, TestingModule } from '@nestjs/testing';
import { TendrilsController } from './tendrils.controller';

describe('TendrilsController', () => {
  let controller: TendrilsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TendrilsController],
    }).compile();

    controller = module.get<TendrilsController>(TendrilsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
