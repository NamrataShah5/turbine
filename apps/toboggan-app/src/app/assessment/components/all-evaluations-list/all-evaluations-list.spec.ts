import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { of } from 'rxjs';
import { AssessmentService } from '../../services/assessment.service';

import { AllEvaluationsListComponent } from './all-evaluations-list.component';

describe('AllEvaluationsListComponent with empty results ', () => {
  let component: AllEvaluationsListComponent;
  let fixture: ComponentFixture<AllEvaluationsListComponent>;
  const mockEvaluatedAssessmentService = {
    fetchEvaluatedAssessments: jest.fn().mockReturnValue(of([])),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoriesModule, NoopAnimationsModule],
      declarations: [AllEvaluationsListComponent],
      providers: [
        { provide: AssessmentService, useValue: mockEvaluatedAssessmentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AllEvaluationsListComponent);
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
