import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
} from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { mock, MockProxy } from 'jest-mock-extended';
import { of } from 'rxjs';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { ModalAlertService } from '../../../shared/services/modal-alert/modal-alert.service';
import { SharedModule } from '../../../shared/shared.module';
import { mockStaffProfile } from '../../pages/staff-profile-main.mock';
import { StaffProfileService } from '../../services/staff-profile.service';

import { PersonalTabComponent } from './personal-tab.component';

describe('PersonalTabComponent', () => {
  let component: PersonalTabComponent;
  let fixture: ComponentFixture<PersonalTabComponent>;
  let modalAlertService: ModalAlertService;
  let staffProfileService: StaffProfileService;

  const mockStaffProfileService: MockProxy<StaffProfileService> =
    mock<StaffProfileService>();
  const mockBannerService = {
    showBanner: jest.fn().mockReturnValueOnce(of(true)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        { provide: StaffProfileService, useValue: mockStaffProfileService },
        { provide: BannerService, useValue: mockBannerService },
      ],
      declarations: [PersonalTabComponent],
      imports: [ReactiveFormsModule, HttpClientModule, SharedModule],
    }).compileComponents();

    modalAlertService = TestBed.inject(ModalAlertService);
    fixture = TestBed.createComponent(PersonalTabComponent);
    staffProfileService = TestBed.inject(StaffProfileService);
    component = fixture.componentInstance;
    component.profile = mockStaffProfile;
    fixture.detectChanges();
  });

  it('should create', () => {
    const getStaffProfileSpy = jest.spyOn(component, 'setDetailsForm');
    expect(component).toBeTruthy();
    component.ngOnChanges({
      profile: new SimpleChange(null, mockStaffProfile, true),
    });
    expect(getStaffProfileSpy).toHaveBeenCalled();
  });

  it('should show edit option', () => {
    const spy = jest.spyOn(component, 'toggleEditMode');
    const staffProfileEditBtn = fixture.debugElement.query(
      By.css('.staff-edit-btn')
    ).nativeElement;
    staffProfileEditBtn.click();
    fixture.detectChanges();
    expect(spy).toBeCalled();
  });

  it('should show list of pronouns', () => {
    component.toggleMorePronouns();
    fixture.detectChanges();
    expect(component.isExpanded).toBeTruthy();
  });
  it('select a pronoun from pronouns list', () => {
    const pronoun = 'he/him/his';
    component.selectPronoun(pronoun);
    fixture.detectChanges();
    expect(
      component.personalDetailsForm.get('preferredPronoun')?.value
    ).toEqual(pronoun);
  });

  it('should open discard changes confirmation modal', () => {
    component.editMode = true;
    const spy = jest.spyOn(modalAlertService, 'showModalAlert');
    component.personalDetailsForm.markAsDirty();
    fixture.detectChanges();
    const discardChangesBtn = fixture.debugElement.query(
      By.css('.discard-changes-btn')
    ).nativeElement;
    discardChangesBtn.click();
    fixture.detectChanges();
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        heading: `Leave this page?`,
      })
    );
  });

  it('should call update call with valid details ', async () => {
    const saveLearnerProfileSpy = jest.spyOn(
      staffProfileService,
      'updateProfile'
    );
    component.personalDetailsForm.setValue({
      firstName: 'Down',
      lastName: 'Hall',
      preferredName: 'Down Hall',
      preferredPronoun: 'she/her/hers',
      bio: 'hi am a staff',
    });
    const updateDetails = {
      preferredName: 'Down Hall',
      preferredPronoun: 'she/her/hers',
      bio: 'hi am a staff',
    };
    const mockResponse = mockStaffProfile;
    mockResponse['preferredName'] = 'Down';
    await component.saveStaffProfile();
    expect(component.personalDetailsForm.valid).toBeTruthy();
    expect(saveLearnerProfileSpy).toHaveBeenCalledWith(
      component.profile.uuid,
      updateDetails
    );
  });

  it('Should call banner service after profile is updated', async () => {
    const showBannerSpy = jest.spyOn(mockBannerService, 'showBanner');
    component.personalDetailsForm.setValue({
      firstName: 'Down',
      lastName: 'Hall',
      preferredName: 'Down Hall',
      preferredPronoun: 'she/her/hers',
      bio: 'hi am a staff',
    });
    const mockResponse = mockStaffProfile;
    mockResponse['preferredName'] = 'Down';
    await component.saveStaffProfile();
    expect(showBannerSpy).toBeCalled();
  });
});
