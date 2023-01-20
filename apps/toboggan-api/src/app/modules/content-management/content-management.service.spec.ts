import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { ContentManagementService } from './content-management.service';

describe('ContentManagementService', () => {
  let service: ContentManagementService;
  let http: HttpService;
  const data = {
    data: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ContentManagementService],
    }).compile();

    service = module.get<ContentManagementService>(ContentManagementService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should getCurriculumPathway', (done) => {
    const id = '0VPMohg8e7GWDWiIPMp2';
    jest.spyOn(http, 'get').mockImplementation(() => of(data as any));
    expect(      
      service.getCurriculumPathway(id).subscribe((response) => {
        expect(http.get).toBeCalledWith(`/curriculum-pathway/${id}?fetch_tree=true`);
        expect(response).toEqual(data);
        done();
      })
    );
  });
});
