import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AssessmentService } from './assessment.service';

describe('AssessmentService', () => {
  let service: AssessmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AssessmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should have called api for subittedAssessment', () => {
    service.updateSubmittedAssessment('1', {} as any);
    const req = httpMock.expectOne(`/api/assessments/subittedAssessment/1`);
    expect(req.request.method).toBe('PUT');
    req.flush([]);
  });
});
