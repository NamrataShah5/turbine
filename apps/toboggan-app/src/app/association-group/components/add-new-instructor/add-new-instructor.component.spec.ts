import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
} from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { mock, MockProxy } from 'jest-mock-extended';
import { of } from 'rxjs';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { UserService } from '../../../shared/services/user/user.service';
import { SharedModule } from '../../../shared/shared.module';
import { AssociationGroupService } from '../../services/association-group.service';

import { AddNewInstructorComponent } from './add-new-instructor.component';

const mockUsers = [
  {
    userType: 'type',
    userName: 'user1',
    status: 'status',
    userId: 'userid1',
    firstName: 'name1',
    lastName: 'last1',
    email: 'email1@sada.com',
    groups: [],
    userGroups: [],
  },
];
describe('AddNewInstructorComponent', () => {
  let component: AddNewInstructorComponent;
  let fixture: ComponentFixture<AddNewInstructorComponent>;
  const mockUserService = {
    fetchUsers: jest.fn().mockReturnValue(of(mockUsers)),
  };
  const mockGroupService: MockProxy<AssociationGroupService> =
    mock<AssociationGroupService>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewInstructorComponent],
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        { provide: AssociationGroupService, useValue: mockGroupService },
        BannerService,
      ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        StoriesModule,
        ReactiveFormsModule,
        SharedModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const geInstructorSpy = jest.spyOn(component, 'getInstructors');
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(geInstructorSpy).toHaveBeenCalled();
  });
});
