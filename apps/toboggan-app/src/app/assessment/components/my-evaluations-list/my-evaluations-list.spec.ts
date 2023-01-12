import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { of } from 'rxjs';
import { AssessmentService } from '../../services/assessment.service';

import { MyEvaluationsListComponent } from './my-evaluations-list.component';

describe('MyEvaluationsListComponent with empty results ', () => {
  let component: MyEvaluationsListComponent;
  let fixture: ComponentFixture<MyEvaluationsListComponent>;
  const mockEvaluatedAssessmentService = {
    fetchEvaluatedAssessments: jest.fn().mockReturnValue(of([])),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoriesModule, NoopAnimationsModule],
      declarations: [MyEvaluationsListComponent],
      providers: [
        { provide: AssessmentService, useValue: mockEvaluatedAssessmentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyEvaluationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service for fetching evaluated assessments', () => {
    const fetchEvaluatedAssessments = jest.spyOn(mockEvaluatedAssessmentService, 'fetchEvaluatedAssessments');
    fixture.detectChanges();
    expect(fetchEvaluatedAssessments).toHaveBeenCalled();
  });

  it('table should show "No evaluated assessments yet" when no assessments are available', () => {
    const noResultsContainer = fixture.debugElement.query(
      By.css('.gp-table-x-noresults')
    );
    expect(noResultsContainer).toBeDefined();
  });
});
