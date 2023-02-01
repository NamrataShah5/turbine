import { Test, TestingModule } from '@nestjs/testing';
import { AssociationGroupController } from './association-group.controller';
import { AssociationGroupService } from './association-group.service';

describe('AssociationGroupController', () => {
  let controller: AssociationGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssociationGroupController],
      providers: [AssociationGroupService],
    }).compile();

    controller = module.get<AssociationGroupController>(AssociationGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
