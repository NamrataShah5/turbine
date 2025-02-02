import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { mock, MockProxy } from 'jest-mock-extended';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { EMPTY, of } from 'rxjs';
import { AuthService } from '../../../shared/auth/auth.service';
import { SharedModule } from '../../../shared/shared.module';
import { AssessmentListComponent } from '../../components/assessment-list/assessment-list.component';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentMainPageComponent } from './assessment-main-page.component';

const mockAssessmentService = {
  fetchAssessmentsById: jest.fn().mockReturnValue(of({})),
  allPendingListCount: EMPTY,
  myPendingListCount: EMPTY,

};
const mockAuthService: MockProxy<AuthService> = mock<AuthService>();

describe('AssessmentMainPageComponent', () => {
  let component: AssessmentMainPageComponent;
  let fixture: ComponentFixture<AssessmentMainPageComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoriesModule,
        SharedModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        TypeaheadModule.forRoot(),
      ],
      declarations: [AssessmentMainPageComponent, AssessmentListComponent],
      providers: [ { provide: AssessmentService, useValue: mockAssessmentService},
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: Router,
          useValue: {},
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(AssessmentMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
