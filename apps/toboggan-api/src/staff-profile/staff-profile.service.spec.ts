import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { environment } from '../environments/environment';
import { StaffProfileService } from './staff-profile.service';

describe('StaffProfileService', () => {
  let module: TestingModule;
  let service: StaffProfileService;
  let http: HttpService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          baseURL: environment.GPCoreBaseUrl + '/user-management/api/v1',
          timeout: 8000,
          maxRedirects: 3,
        }),
      ],
      providers: [StaffProfileService],
    }).compile();
  });

  beforeEach(async () => {
    http = module.get<HttpService>(HttpService);
    service = module.get<StaffProfileService>(StaffProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
