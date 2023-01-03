import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { mock, MockProxy } from 'jest-mock-extended';
import { of } from 'rxjs';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { ModalAlertService } from '../../../shared/services/modal-alert/modal-alert.service';
import { mockStaffProfile } from '../../pages/staff-profile-main.mock';
import { StaffProfileService } from '../../services/staff-profile.service';

import { ContactTabComponent } from './contact-tab.component';

describe('ContactTabComponent', () => {
  let component: ContactTabComponent;
  let fixture: ComponentFixture<ContactTabComponent>;
  let modalAlertService: ModalAlertService;
  let staffProfileService: StaffProfileService;

  const mockStaffProfileService: MockProxy<StaffProfileService> = mock<StaffProfileService>();
  const mockBannerService = {
    showBanner: jest.fn().mockReturnValueOnce(of(true)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler,
        { provide: StaffProfileService, useValue: mockStaffProfileService },
        { provide: BannerService, useValue: mockBannerService }
      ],
      declarations: [ContactTabComponent],
      imports: [ReactiveFormsModule, HttpClientModule]
    })
      .compileComponents();

    modalAlertService = TestBed.inject(ModalAlertService);
    fixture = TestBed.createComponent(ContactTabComponent);
    staffProfileService = TestBed.inject(StaffProfileService);
    component = fixture.componentInstance;
    component.profile = mockStaffProfile;
    fixture.detectChanges();
  });

  it('should create', () => {
    const getStaffProfileSpy = jest.spyOn(component, 'setDetailsForm');
    expect(component).toBeTruthy();
    component.ngOnChanges(
      {
        profile: new SimpleChange(null, mockStaffProfile, true)
      }
    );
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

  it('should open discard changes confirmation modal', () => {
    component.editMode = true;
    const spy = jest.spyOn(modalAlertService, 'showModalAlert');
    component.contactDetailsForm.markAsDirty();
    fixture.detectChanges();
    const discardChangesBtn = fixture.debugElement.query(
      By.css('.discard-changes-btn')
    ).nativeElement;
    discardChangesBtn.click();
    fixture.detectChanges();
    expect(spy).toBeCalledWith(expect.objectContaining({
      'heading': `Leave this page?`
    }))
  });

  it('should call update call with valid details ', async () => {
    const saveLearnerProfileSpy = jest.spyOn(staffProfileService, 'updateProfile');
    component.contactDetailsForm.setValue({
      email: 'abc@test.com',
      phoneNumber: '(365) 123-4453',
      inboxes: 'instructors@snhu.edu'
    });
    const updateDetails = {
      phoneNumber: '(365) 123-4453',
    }
    const mockResponse = mockStaffProfile;
    mockResponse['phoneNumber'] = "(365) 123-4452";
    await component.saveStaffProfile();
    expect(component.contactDetailsForm.valid).toBeTruthy();
    expect(saveLearnerProfileSpy).toHaveBeenCalledWith(
      component.profile.uuid,
      updateDetails
    );
  });

  it('Should call banner service after profile is updated', async () => {
    const showBannerSpy = jest.spyOn(mockBannerService, 'showBanner');
    component.contactDetailsForm.setValue({
      email: 'abc@test.com',
      phoneNumber: '(365) 123-4453',
      inboxes: 'instructors@snhu.edu'
    });
    const mockResponse = mockStaffProfile;
    mockResponse['phoneNumber'] = "(365) 123-4452";
    await component.saveStaffProfile();
    expect(showBannerSpy).toBeCalled();
  });
});
