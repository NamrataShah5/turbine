import { Test, TestingModule } from '@nestjs/testing';
import { AssociationGroupService } from './association-group.service';

describe('AssociationGroupService', () => {
  let service: AssociationGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssociationGroupService],
    }).compile();

    service = module.get<AssociationGroupService>(AssociationGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
