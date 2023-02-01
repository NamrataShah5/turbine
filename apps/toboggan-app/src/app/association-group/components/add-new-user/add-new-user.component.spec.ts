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

import { AddNewUserComponent } from './add-new-user.component';
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
describe('AddNewUserComponent', () => {
  let component: AddNewUserComponent;
  let fixture: ComponentFixture<AddNewUserComponent>;
  const mockUserService = {
    fetchUsers: jest.fn().mockReturnValue(of(mockUsers)),
  };
  const mockGroupService: MockProxy<AssociationGroupService> =
    mock<AssociationGroupService>();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewUserComponent],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        StoriesModule,
        ReactiveFormsModule,
        SharedModule,
      ],
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
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
