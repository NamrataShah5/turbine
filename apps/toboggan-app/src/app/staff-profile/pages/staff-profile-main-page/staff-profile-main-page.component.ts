/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStaffProfile } from '@toboggan-ws/toboggan-common';
import { StaffProfileService } from '../../services/staff-profile.service';

@Component({
  selector: 'toboggan-ws-staff-profile-main-page',
  templateUrl: './staff-profile-main-page.component.html',
  styleUrls: ['./staff-profile-main-page.component.scss']
})
export class StaffProfileMainPageComponent implements OnInit {
  id: any;
  profile = {} as IStaffProfile;
  constructor(private route: ActivatedRoute, private staffService: StaffProfileService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getStaffProfile();
  }

  getStaffProfile() {
    this.staffService.fetchStaffProfile(this.id).subscribe((profile: any) => {
      this.profile = profile;
    })
  }
}
