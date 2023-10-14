import { Test, TestingModule } from '@nestjs/testing';
import { PlantsController } from './plants.controller';

describe('PlantsController', () => {
  let controller: PlantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantsController],
    }).compile();

    controller = module.get<PlantsController>(PlantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
