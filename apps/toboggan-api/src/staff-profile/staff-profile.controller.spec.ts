import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { environment } from '../environments/environment';
import { StaffProfileController } from './staff-profile.controller';
import { mockStaffProfile } from './staff-profile.mock';
import { StaffProfileService } from './staff-profile.service';

describe('StaffProfileController', () => {
  let controller: StaffProfileController;
  let service: StaffProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          baseURL:
            environment.GPCoreBaseUrl + '/user-management/api/v1',
          timeout: 8000,
          maxRedirects: 3,
        })
      ],
      controllers: [StaffProfileController],
      providers: [StaffProfileService]
    }).compile();

    service = module.get<StaffProfileService>(StaffProfileService);
    controller = module.get<StaffProfileController>(StaffProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStaffProfile', () => {
    it('should return a profile', async () => {
      const profile = mockStaffProfile[0];
      jest.spyOn(service, 'getProfile').mockImplementation(() => profile);

      expect(await controller.getStaffProfile(profile?.uuid)).toBe(profile);
    });
    3
  });
  describe('updateProfile', () => {
    it('should update staff profile', async () => {
      const updatedProfile = mockStaffProfile[0];
      jest.spyOn(service, 'updateProfile');

      await controller.updateStaffProfile(
        updatedProfile?.uuid,
        updatedProfile
      );

      expect(service.updateProfile).toBeCalledWith(
        updatedProfile?.uuid,
        updatedProfile
      );
    });
  });
});
