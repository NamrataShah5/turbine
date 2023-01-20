import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';

import { ContentService } from './content.service';

describe('ContentService', () => {
  let service: ContentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
    });
    service = TestBed.inject(ContentService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('service methods call proper API endpoints', () => {
    service.downloadContent('test');
    httpTestingController.expectOne((req) => {
      return req.url.includes('content-serving/data');
    });

    service.getSignedUrl('url');
    httpTestingController.expectOne((req) => {
      return req.url.includes('content-serving/url');
    });

    service.getFile('filename');
    httpTestingController.expectOne((req) => {
      return req.url.includes('content/filename');
    });
  });
});
