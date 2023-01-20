import { TestBed } from '@angular/core/testing';

import { ContentSelectionService } from './content-selection.service';

describe('ContentSelectionService', () => {
  let service: ContentSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
