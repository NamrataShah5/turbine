/* eslint-disable no-prototype-builtins */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  TableDataGenerator,
  TableRow
} from '@snhuproduct/toboggan-ui-components-library';
import { IRowActionEvent } from '@snhuproduct/toboggan-ui-components-library/lib/table/row-action-event.interface';
import {
  getDateDiffObject,
  getFormattedDateDiff,
  IAssessment
} from '@toboggan-ws/toboggan-common';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../shared/auth/auth.service';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { ModalAlertService } from '../../../shared/services/modal-alert/modal-alert.service';
import {
  ITableDataGeneratorFactoryOutput,
  ITableFilter,
  ITableFilterItems,
  TableDataService
} from '../../../shared/services/table-data/table-data.service';
import { AssessmentService } from '../../services/assessment.service';
import { assessmentTableHeader, RowActions } from './assessment-table.type';
const THRESHOLD_OF_RED = 0;
const THRESHOLD_OF_YELLOW = 6 * 60 * 60 * 1000; // 6 hours

@Component({
  selector: 'toboggan-ws-assessment-list',
  templateUrl: './assessment-list.component.html',
})
export class AssessmentListComponent implements OnInit, OnDestroy {
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
  private updateAssessmentSubscription: Subscription = {} as Subscription;
  @Input() selectedTab = 'toBeEvaluate';

  constructor(
    private assessmentService: AssessmentService,
    private tableDataService: TableDataService,
    private router: Router,
    private modalAlertService: ModalAlertService,
    private bannerService: BannerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.refreshTableData();
  }

  ngOnDestroy(): void {
    [this.datageneratorSubscription, this.updateAssessmentSubscription].map(
      (s) => {
        if (s.unsubscribe) s.unsubscribe();
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
      case RowActions.Evaluate:
        this.router.navigate([`/assessment/details/${rowId}`]);
        break;
      case RowActions.RemoveFlag:
        this.unFlagConfirmationModal(rowData);
        break;
    }
  }

  handleAssessmentAction(id: string | undefined) {
    if (this.selectedOption === RowActions.ReturnUnEvaluated && id) {
      this.refreshTableData();
    }
    this.showAssessmentModal = false;
  }

  getActionMenuItems = (rowData: TableRow) => {
    const actionMenuItems = [RowActions.ReturnUnEvaluated];
    if (rowData.cellData['flagged']) {
      actionMenuItems.push(RowActions.RemoveFlag);
    } else {
      actionMenuItems.push(RowActions.FlagForInstructorReview);
    }
    return this.selectedTab === 'toBeEvaluate'
      ? [...actionMenuItems, RowActions.Evaluate]
      : actionMenuItems;
  };

  formatTableRowsWithAssessmentData(fetchedData: unknown): TableRow[] {
    //API call
    const assessments = fetchedData as IAssessment[];

    const data = assessments.map((cellData, index) => {
      const actionIcon = cellData.flagged ? 'gp-icon-flag' : '';
      const className = cellData.flagged ? 'gp-table-x-bodyrow-diabled' : '';
      const dateDiffObj = getDateDiffObject(cellData.timerStartTime, new Date());

      const timeLeftCellColor =
        dateDiffObj.diff < THRESHOLD_OF_RED
          ? 'gp-red-20'
          : dateDiffObj.diff >= THRESHOLD_OF_RED &&
            dateDiffObj.diff < THRESHOLD_OF_YELLOW
            ? 'gp-yellow-20'
            : '';

      const attemptBorderCellClass =
        cellData.maxAttempts > cellData.attemptNo
          ? 'gp-table-x-cell-warning-border'
          : '';

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

      const timeLeftCellObject:any = cellData.flagged
        ? pausedTimeLeftCellObject
        : defaultTimeLeftCellObject;

      return {
        rowId: String(index + 1),
        actionIcon,
        className,
        cellData: {
          id: cellData.id,
          uuid: cellData.uuid,
          time_left: timeLeftCellObject,
          learnerName: cellData.learnerName,
          learnerId: cellData.learnerId,
          unitName: cellData.unitName,
          type: cellData.type,
          flagged: cellData.flagged,
          attempt: {
            0: cellData.attemptNo,
            1: cellData.maxAttempts,
            cellClass: attemptBorderCellClass,
          },
          instructorName: cellData.instructorName,
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

    const [prevCurrentPage] = [
      this.dataGenerator.currentPage || this.currentPage,
    ];
    this.dataGeneratorFactoryOutputObserver =
      this.tableDataService.dataGeneratorFactoryObs(
        this.assessmentService.fetchAssessmentsById(this.authService?.currentUser?.uid),
        assessmentTableHeader,
        this.formatTableRowsWithAssessmentData,
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
          this.assessmentService.passmyPendingListCount(this.assessmentList.length);
        }
      );
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
