import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IStaffProfile } from '@toboggan-ws/toboggan-common';
import { mockStaffProfile } from '../pages/staff-profile-main.mock';

import { StaffProfileService } from './staff-profile.service';

describe('StaffProfileService', () => {
  let service: StaffProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(StaffProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have called api for fetching staff profile', () => {
    const uuid = mockStaffProfile.uuid;
    service.fetchStaffProfile(uuid).subscribe();
    const req = httpMock.expectOne(`/api/staff-profile/${uuid}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStaffProfile);
  });

  it('should have called api for updating staff profile', async () => {
    const updatedStaffProfile: IStaffProfile = mockStaffProfile;
    setTimeout(() => {
      const req = httpMock.expectOne(`/api/staff-profile/${updatedStaffProfile.uuid}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toBe(updatedStaffProfile);
      req.flush(updatedStaffProfile);
      httpMock.verify();
    });
  });
});
