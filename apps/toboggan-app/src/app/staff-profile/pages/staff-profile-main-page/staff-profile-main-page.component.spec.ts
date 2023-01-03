import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StaffProfileMainPageComponent } from './staff-profile-main-page.component';

describe('StaffProfileMainPageComponent', () => {
  let component: StaffProfileMainPageComponent;
  let fixture: ComponentFixture<StaffProfileMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffProfileMainPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffProfileMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const getStaffProfileSpy = jest.spyOn(component, 'getStaffProfile');
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(getStaffProfileSpy).toHaveBeenCalled();
  });
});
