/* eslint-disable no-prototype-builtins */
import {
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import {
  TableDataGenerator,
  TableRow
} from '@snhuproduct/toboggan-ui-components-library';
import { IAssessment } from '@toboggan-ws/toboggan-common';
import { Observable, Subscription } from 'rxjs';
import {
  ITableDataGeneratorFactoryOutput,
  ITableFilter,
  ITableFilterItems,
  TableDataService
} from '../../../shared/services/table-data/table-data.service';
import { AssessmentService } from '../../services/assessment.service';
import { evaluatedAssessmentTableHeader } from './all-evaluations-list.type';

@Component({
  selector: 'toboggan-ws-assessment-all-evaluations-list',
  templateUrl: './all-evaluations-list.component.html',
})
export class AllEvaluationsListComponent implements OnInit, OnDestroy {
  dataGenerator: TableDataGenerator = {} as TableDataGenerator;
  assessmentList: TableRow[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  filters: ITableFilter[] = [];

  private dataGeneratorFactoryOutputObserver: Observable<ITableDataGeneratorFactoryOutput> =
    {} as Observable<ITableDataGeneratorFactoryOutput>;
  private datageneratorSubscription: Subscription = {} as Subscription;
  private updateEvaluatedAssessmentSubscription: Subscription = {} as Subscription;

  constructor(
    private assessmentService: AssessmentService,
    private tableDataService: TableDataService,
  ) { }

  ngOnInit(): void {
    this.refreshTableData();
  }

  ngOnDestroy(): void {
    [this.datageneratorSubscription, this.updateEvaluatedAssessmentSubscription].map((s) => {
      if (s.unsubscribe) s.unsubscribe();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getActionMenuItems = () => {
    return ['view details'];
  };

  formatTableRowsWithAssessmentsData(fetchedData: unknown): TableRow[] {
    //API call
    const assessments = fetchedData as IAssessment[];

    const data = assessments.map((cellData, index) => {
      return {
        rowId: String(index + 1),
        cellData: {
          learner: cellData.learner,
          result: {
            cellType: cellData.resultComment ? 'tooltip' : null,
            cellTypeOptions: {
              heading: 'Comments',
              text: cellData.resultComment
            },
            value: cellData.result,
          },
          discipline: cellData.discipline,
          unit: cellData.unit,
          type: cellData.type,
          attempt: [cellData.currentAttempt, cellData.attempts],
          instructor: cellData.instructor,
          evaluatedBy: cellData.evaluatedBy,
        },
      };
    });

    return data as TableRow[];
  }

  private refreshTableData(filtersSelected: ITableFilterItems[] = []) {
    if (this.datageneratorSubscription.unsubscribe) {
      this.datageneratorSubscription.unsubscribe();
    }
    const [prevSearchString, prevCurrentPage] = [
      this.dataGenerator.searchString || '',
      this.dataGenerator.currentPage || this.currentPage,
    ];
    this.dataGeneratorFactoryOutputObserver =
      this.tableDataService.dataGeneratorFactoryObs(
        this.assessmentService.fetchEvaluatedAssessments(),
        evaluatedAssessmentTableHeader,
        this.formatTableRowsWithAssessmentsData,
        this.itemsPerPage,
        prevCurrentPage,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => { },
        [],
        filtersSelected
      );
    this.datageneratorSubscription =
      this.dataGeneratorFactoryOutputObserver.subscribe(
        (dataGeneratorFactoryOutput) => {
          this.dataGenerator = dataGeneratorFactoryOutput.dataGenerator;
          this.assessmentList = dataGeneratorFactoryOutput.tableRows as TableRow[];
          if (this.assessmentList.length) this.setFilterOptions();
          this.dataGenerator.searchString = prevSearchString;
        }
      );
  }

  setFilterOptions() {
    if (!this.filters.length) {
      this.filters = this.tableDataService.setFiltersInTable(this.assessmentList, this.dataGenerator);
    }
  }
  filterAssessmentList(filterList: ITableFilterItems[]) {
    this.refreshTableData(filterList.length ? filterList : []);
  }
}
