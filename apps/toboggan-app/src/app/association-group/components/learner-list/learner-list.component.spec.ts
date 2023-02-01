import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'ramda';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { UserService } from '../../../shared/services/user/user.service';

import { LearnerListComponent } from './learner-list.component';

describe('LearnerListComponent', () => {
  let component: LearnerListComponent;
  let fixture: ComponentFixture<LearnerListComponent>;
  const mockEmptyUserService = {
    fetchUsers: jest.fn().mockReturnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LearnerListComponent],
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: UserService,
          useValue: mockEmptyUserService,
        },
        BannerService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LearnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
