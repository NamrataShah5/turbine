import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  TableDataGenerator,
  TableRow
} from '@snhuproduct/toboggan-ui-components-library';
import { IRowActionEvent } from '@snhuproduct/toboggan-ui-components-library/lib/table/row-action-event.interface';
import { getDateDiffObject, getFormattedDateDiff, getTimeleftColor, IAssessment } from '@toboggan-ws/toboggan-common';
import { Observable, Subscription } from 'rxjs';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { ModalAlertService } from '../../../shared/services/modal-alert/modal-alert.service';
import {
  ITableDataGeneratorFactoryOutput,
  ITableFilter,
  ITableFilterItems,
  TableDataService
} from '../../../shared/services/table-data/table-data.service';
import { AssessmentService } from '../../services/assessment.service';
import { RowActions } from '../assessment-list/assessment-table.type';
import { evaluationBacklogTableHeader } from './evaluation-backlog-table.type';

@Component({
  selector: 'toboggan-ws-evaluation-backlog',
  templateUrl: './evaluation-backlog.component.html',
})
export class EvaluationBacklogComponent implements OnInit, OnDestroy {
  dataGenerator: TableDataGenerator = {} as TableDataGenerator;
  assessmentList: TableRow[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  showAssessmentModal = false;
  editAssessmentData!: IAssessment;
  selectedOption!: RowActions;
  filters: ITableFilter[] = [];
  private dataGeneratorFactoryOutputObserver: Observable<ITableDataGeneratorFactoryOutput> =
    {} as Observable<ITableDataGeneratorFactoryOutput>;
  private datageneratorSubscription: Subscription = {} as Subscription;
  private updateEvaluationBacklogAssessmentSubscription: Subscription =
    {} as Subscription;

  constructor(
    private assessmentService: AssessmentService,
    private tableDataService: TableDataService,
    private router: Router,
    private modalAlertService: ModalAlertService,
    private bannerService: BannerService
  ) { }

  ngOnInit(): void {
    this.refreshTableData();
  }

  ngOnDestroy(): void {
    [
      this.datageneratorSubscription,
      this.updateEvaluationBacklogAssessmentSubscription,
    ].map((s) => {
      if (s.unsubscribe) s.unsubscribe();
    });
  }

  getActionMenuItems = (rowData: TableRow) => {
    const actionMenuItems = [
      `Evaluate for ${rowData.cellData['assignedTo']}`,
      RowActions.ReturnUnEvaluated,
    ];
    if (rowData.cellData['flagged']) {
      actionMenuItems.push(RowActions.RemoveFlag);
    } else {
      actionMenuItems.push(RowActions.FlagForInstructorReview);
    }
    return actionMenuItems;
  };


  formatTableRowsWithAssessmentsData(fetchedData: unknown): TableRow[] {
    const assessments = fetchedData as IAssessment[];
    const data = assessments.map((cellData, index) => {
      const dateDiffObj = getDateDiffObject(cellData.timeLeft, new Date());
      const timeLeftCellColor = getTimeleftColor(dateDiffObj);
      const pausedTimeLeftCellObject = {
        value: 'Paused',
        cellType: 'icon-right',
        cellTypeOptions: {
          icon: 'gp-icon-lock',
          iconClass: 'gp-fill-cool-gray-100',
        },
      };
      const defaultTimeLeftCellObject = {
        value: getFormattedDateDiff(dateDiffObj),
        cellClass: timeLeftCellColor,
      };
      const timeLeftCellObject = cellData.flagged
        ? pausedTimeLeftCellObject
        : defaultTimeLeftCellObject;
      const actionIcon = cellData.flagged ? 'gp-icon-flag' : '';
      return {
        rowId: String(index + 1),
        actionIcon,
        cellData: {
          time_left: timeLeftCellObject,
          uuid: cellData.uuid,
          learner: cellData.learner,
          learnerId: cellData.learnerId,
          flagged: cellData.flagged,
          competency: cellData.competency,
          type: cellData.type,
          attempt: [cellData.currentAttempt, cellData.attempts],
          instructor: cellData.instructor,
          assignedTo: cellData.assignedTo,
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
        this.assessmentService.fetchEvaluationBacklog(),
        evaluationBacklogTableHeader,
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
          this.assessmentList =
            dataGeneratorFactoryOutput.tableRows as TableRow[];
          if (this.assessmentList.length) this.setFilterOptions();
          this.assessmentService.passAllPendingListCount(this.assessmentList.length);
          this.dataGenerator.searchString = prevSearchString;
        }
      );
  }

  onRowAction(event: IRowActionEvent) {
    const { action, rowId } = event;
    const rowData = this.dataGenerator.rowData.find(
      (row) => row.rowId === rowId
    );

    if (!rowData) {
      throw new Error('Could not find rowData for rowId: ' + rowId);
    }
    if (action.startsWith('Evaluate for')) {
      this.router.navigate([`/assessment/details/${rowId}`])
    }

    switch (action) {
      case RowActions.FlagForInstructorReview:
        this.editAssessmentData = rowData.cellData as unknown as IAssessment;
        this.showAssessmentModal = true;
        this.selectedOption = RowActions.FlagForInstructorReview;
        break;
      case RowActions.ReturnUnEvaluated:
        this.editAssessmentData = rowData.cellData as unknown as IAssessment;
        this.showAssessmentModal = true;
        this.selectedOption = RowActions.ReturnUnEvaluated;
        break;
      case RowActions.RemoveFlag:
        this.unFlagConfirmationModal(rowData);
        break;
    }
  }
  handleEditFlagAssessmentAction(id: string | undefined) {
    if (this.selectedOption === RowActions.ReturnUnEvaluated && id) {
      this.refreshTableData();
    }
    this.showAssessmentModal = false;
  }
  unFlagConfirmationModal(rowData: any) {
    this.modalAlertService.showModalAlert({
      type: 'warning',
      heading: 'Remove this flag?',
      message: `If you do, this submission will be added back to your evaluation list, and you'll have 48 hours to evaluate it.`,
      buttons: [
        {
          title: 'No, cancel',
          onClick: () => {
            this.modalAlertService.hideModalAlert();
          },
          style: 'secondary',
        },
        {
          title: 'Yes, remove flag',
          onClick: async () => {
            try {
              this.modalAlertService.hideModalAlert();
              const body = {
                isFlagged: false,
              };
              await this.assessmentService.updateSubmittedAssessment(
                rowData.cellData.uuid,
                body
              );
              this.bannerService.showBanner({
                type: 'success',
                heading: '',
                message: `<b>${rowData.cellData.learner}</b>'s submission is no longer flagged. You now have 48 hours to evaluate it.`,
                button: null,
                autoDismiss: true,
              });
            } catch (error) {
              this.bannerService.showBanner({
                type: 'error',
                heading: '',
                message: `The flag couldn't be removed from <b>${rowData.cellData.learner}</b>'s submission. Please try again.`,
                button: null,
                autoDismiss: true,
              });
            }
          },
          style: 'primary',
        },
      ],
    });
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
