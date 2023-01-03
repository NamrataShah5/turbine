/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStaffProfile } from '@toboggan-ws/toboggan-common';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffProfileService {

  constructor(private http: HttpClient) { }
  //  IMPORTANT!! - mock endpoint -update when APIs are available from backend
  fetchStaffProfile(uuid: string) {
    return this.http.get<IStaffProfile>('/api/staff-profile/' + uuid);
  }

  //  IMPORTANT!! - mock endpoint -update when APIs are available from backend
  async updateProfile(uuid: string, updatedProfile: any) {
    await firstValueFrom(this.http.put('/api/staff-profile/' + uuid, updatedProfile));
  }
}
