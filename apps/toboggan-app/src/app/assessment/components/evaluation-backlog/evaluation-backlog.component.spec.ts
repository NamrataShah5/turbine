import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  StoriesModule,
  TableDataGenerator
} from '@snhuproduct/toboggan-ui-components-library';
import { of } from 'rxjs';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentDetailsComponent } from '../assessment-details/assessment-details.component';
import { RowActions } from '../assessment-list/assessment-table.type';

import { EvaluationBacklogComponent } from './evaluation-backlog.component';

describe('EvaluationBacklogComponent with empty results ', () => {
  let component: EvaluationBacklogComponent;
  let fixture: ComponentFixture<EvaluationBacklogComponent>;
  const mockData = [
    {
      rowId: '1',
      actionIcon: 'gp-icon-flag',
      cellData: {
        id: '1',
        learnerName: 'Jessica',
        result: null,
        resultComment: null,
        unitName: 'Analyze Written Works',
        type: 'Final',
        attemptNo: 1,
        maxAttempts: 3,
        instructorName: 'Christopher Edwards',
        evaluated: false,
        flagged: true,
        assignedTo: 'Christopher Edwards'
      },
    },
  ];
  const routes: Routes = [
    { path: '/assessment/details/:id', component: AssessmentDetailsComponent },
  ];
  const mockAssessmentService = {
    fetchEvaluationBacklog: jest.fn().mockReturnValue(of([])),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoriesModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      declarations: [EvaluationBacklogComponent],
      providers: [
        {
          provide: AssessmentService,
          useValue: mockAssessmentService,
        },
        { provide: Router, useValue: {} },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EvaluationBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service for fetching evaluated assessments', () => {
    const fetchEvaluationBacklog = jest.spyOn(
      mockAssessmentService,
      'fetchEvaluationBacklog'
    );
    fixture.detectChanges();
    expect(fetchEvaluationBacklog).toHaveBeenCalled();
  });

  it('table should show "No evaluated assessments yet" when no assessments are available', () => {
    const noResultsContainer = fixture.debugElement.query(
      By.css('.gp-table-x-noresults')
    );
    expect(noResultsContainer).toBeDefined();
  });

  it('should call getActionMenuItems() method', () => {
    const rowData: any = mockData[0];
    const actions = component.getActionMenuItems(rowData as any);
    expect(actions).toBeDefined();
  });

  it('should check onRowAction for error', () => {
    component.dataGenerator = {
      rowData: [{ rowId: '2' }],
    } as TableDataGenerator;
    expect(() => {
      component.onRowAction({
        action: 'Flag for instructor review',
        rowId: '5',
      });
    }).toThrow('Could not find rowData for rowId: 5');
  });

  it('should check onRowAction for FlagForInstructorReview', () => {
    component.dataGenerator = {
      rowData: [{ rowId: '2' }],
    } as TableDataGenerator;
    component.onRowAction({
      action: 'Flag for instructor review',
      rowId: '2',
    });
    expect(component.showAssessmentModal).toBe(true);
    expect(component.selectedOption).toBe(RowActions.FlagForInstructorReview);
  });

  it('should check onRowAction for ReturnUnEvaluated', () => {
    component.dataGenerator = {
      rowData: [{ rowId: '2' }],
    } as TableDataGenerator;
    component.onRowAction({
      action: 'Return unevaluated',
      rowId: '2',
    });
    expect(component.showAssessmentModal).toBe(true);
    expect(component.selectedOption).toBe(RowActions.ReturnUnEvaluated);
  });
  it('onRowAction method should call with - argument action RemoveFlag', () => {
    component.dataGenerator = {
      rowData: [{ rowId: '1' }],
    } as TableDataGenerator;
    const unFlagConfirmationModal = jest.spyOn(
      component,
      'unFlagConfirmationModal'
    );
    component.onRowAction({ action: RowActions.RemoveFlag, rowId: '1' });
    expect(unFlagConfirmationModal).toHaveBeenCalled();
  });

  it('should check handleEditFlagAssessmentAction when id passed', () => {
    const spy = jest.spyOn(component, 'refreshTableData' as any);
    component.selectedOption = RowActions.ReturnUnEvaluated;
    component.handleEditFlagAssessmentAction('1');
    expect(spy).toBeCalledTimes(1);
    expect(component.showAssessmentModal).toBe(false);
  });

  it('should check handleEditFlagAssessmentAction when id not passed', () => {
    const spy = jest.spyOn(component, 'refreshTableData' as any);
    component.selectedOption = RowActions.ReturnUnEvaluated;
    component.handleEditFlagAssessmentAction(undefined);
    expect(spy).not.toBeCalledTimes(1);
    expect(component.showAssessmentModal).toBe(false);
  });

  it('should check handleEditFlagAssessmentAction when id is passed but for FlagForInstructorReview', () => {
    const spy = jest.spyOn(component, 'refreshTableData' as any);
    component.selectedOption = RowActions.FlagForInstructorReview;
    component.handleEditFlagAssessmentAction('1');
    expect(spy).not.toBeCalledTimes(1);
    expect(component.showAssessmentModal).toBe(false);
  });

});
