import { Injectable } from '@nestjs/common';
import { IStaffProfile } from '@toboggan-ws/toboggan-common';
import { mockStaffProfile } from './staff-profile.mock';

@Injectable()
export class StaffProfileService {
	private staffProfile: IStaffProfile;

	constructor() {
		this.staffProfile = mockStaffProfile;
	}

	getProfile(uuid: string) {
		if (uuid == this.staffProfile.uuid) {
			return {
				data: {
					data: this.staffProfile,
					success: true
				}
			}
		}
	}

	updateProfile(uuid: string, updatedProfile: IStaffProfile) {
		if (uuid == this.staffProfile.uuid) {
			this.staffProfile = { ...this.staffProfile, ...updatedProfile };
			return {
				data: {
					data: this.staffProfile,
					success: true
				}
			}
		}
	}
}
