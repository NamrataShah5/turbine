import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AssessmentsService } from './assessments.service';

describe('AssessmentsService', () => {
  let service: AssessmentsService;
  let http: HttpService;
  const data = {
    data: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AssessmentsService],
    }).compile();

    service = module.get<AssessmentsService>(AssessmentsService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should updateSubmittedAssessment', (done) => {
    jest.spyOn(http, 'put').mockImplementation(() => of(data as any));
    expect(
      service.updateSubmittedAssessment('1', {}).subscribe((response) => {
        expect(http.put).toBeCalledWith('/submitted-assessment/1', {});
        expect(response).toEqual(data);
        done();
      })
    );
  });
});
