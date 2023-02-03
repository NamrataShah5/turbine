import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TableColumnDisplayMetadatum,
  TableDataGenerator,
  TableRow
} from '@snhuproduct/toboggan-ui-components-library';
import { IRowActionEvent } from '@snhuproduct/toboggan-ui-components-library/lib/table/row-action-event.interface';
import { IAssociationGroup } from '@toboggan-ws/toboggan-common';
import { Observable, Subscription } from 'rxjs';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { IBannerButton } from '../../../shared/services/banner/banner.types';
import { ModalAlertService } from '../../../shared/services/modal-alert/modal-alert.service';
import {
  ITableDataGeneratorFactoryOutput,
  TableDataService
} from '../../../shared/services/table-data/table-data.service';
import { AssociationGroupService } from '../../services/association-group.service';
import { EditAssociationGroupComponent } from '../edit-association-group/edit-association-group.component';
import { groupTableHeader, RowActions } from './group-table.type';

@Component({
  selector: 'toboggan-ws-association-group-list',
  templateUrl: './association-group-list.component.html',
  styleUrls: ['./association-group-list.component.scss'],
})
export class AssociationGroupListComponent implements OnInit, OnDestroy {
  dataGenerator: TableDataGenerator = {} as TableDataGenerator;
  groupList: TableRow[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  columnHeadings: TableColumnDisplayMetadatum[] = [];
  private dataGeneratorFactoryOutputObserver: Observable<ITableDataGeneratorFactoryOutput> =
    {} as Observable<ITableDataGeneratorFactoryOutput>;
  private datageneratorSubscription: Subscription = {} as Subscription;
  private updateGroupSubscription: Subscription = {} as Subscription;
  @ViewChild('editGroup') editGroupTemplate?: ElementRef;
  @ViewChild(EditAssociationGroupComponent) editGroupComponent!: EditAssociationGroupComponent;
  editGroupMode = 'edit';
  editGroupData!: IAssociationGroup;

  showEditGroupModal = false;

  constructor(
    private associationGroupService: AssociationGroupService,
    private tableDataService: TableDataService,
    private modalAlertService: ModalAlertService,
    private router: Router,
    private route: ActivatedRoute,
    private bannerService: BannerService
  ) {}

  ngOnInit(): void {
    if (this.associationGroupService.groupUpdated$) {
      this.updateGroupSubscription = this.associationGroupService.groupUpdated$.subscribe(
        () => {
          this.showEditGroupModal = false;
          this.refreshTableData();
        }
      );
    }
    this.refreshTableData();
  }

  ngOnDestroy(): void {
    [this.datageneratorSubscription, this.updateGroupSubscription].map((s) => {
      if (s.unsubscribe) s.unsubscribe();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getActionMenuItems = (rowData: TableRow) => {
    const actions = [
      RowActions.ViewDetails,
      RowActions.Edit,
      RowActions.Delete,
    ];
    return actions;
  };

  onRowAction(event: IRowActionEvent) {
    const { action, rowId } = event;
    const rowData = this.dataGenerator.rowData.find(
      (row) => row.rowId === rowId
    );
    if (!rowData) {
      throw new Error('Could not find rowData for rowId: ' + rowId);
    }
    const { uuid: associationGroupId } = rowData.cellData;

    switch (action) {
      case RowActions.Edit:
        this.editGroupData = rowData.cellData as unknown as IAssociationGroup;
        this.showEditGroupModal = true;
        break;
      case RowActions.ViewDetails:
        this.router.navigate([`/association-group/details/${associationGroupId}`], {
          relativeTo: this.route,
        });
        break;
      case RowActions.Delete:
        this.openDeleteGroupConfirmation(rowData.cellData as unknown as IAssociationGroup);
        break;
    }
  }

  formatTableRowsWithGroupData(fetchedData: unknown): TableRow[] {
    //API call
    const groups = fetchedData as IAssociationGroup[];

    // TODO: Ideally it should come sorted from our API!
    const groupsSortedByName = groups.sort((a, b) => {
      if (a.name && b.name) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
      }

      return 0;
    });

    const data = groupsSortedByName.map((group, index) => {
      const mapGroupType = (type: string) => {
        switch(type){
          case 'learner':
            return 'Learner group';
          case 'discipline':
            return 'Discipline group';
          default:
            return type;
        }
      }
      return {
        rowId: String(index + 1),
        cellData: {
          name: group.name,
          type: mapGroupType(group.type),
          description: group.description,
          uuid: group.uuid,
        },
      };
    });

    return data as TableRow[];
  }



  openDeleteGroupConfirmation(group: IAssociationGroup) {
    const { uuid, name, type } = group;

    const learnerGroupMessage = `If you remove ${name}, the learner in ths group will no longer be associated with their assigned coach/instructor(s). This action is not reversible.`;
    const disciplineGroupMessage = `If you remove ${name}, the users in ths group will no longer be associated with this discipline. This action is not reversible.`;

    this.modalAlertService.showModalAlert({
      type: 'warning',
      heading: `Remove this association group`,
      message: type === 'learner' ? learnerGroupMessage : disciplineGroupMessage,
      buttons: [
        {
          title: 'No, keep',
          onClick: () => {
            this.modalAlertService.hideModalAlert();
          },
          style: 'secondary',
        },
        {
          title: 'Yes, remove',
          onClick: async () => {
            this.deleteGroup(uuid, name);
          },
          style: 'primary',
        },
      ],
    });
  }

  private refreshTableData() {
    if (this.datageneratorSubscription.unsubscribe) {
      this.datageneratorSubscription.unsubscribe();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [prevSearchString, prevCurrentPage] = [
      this.dataGenerator.searchString || '',
      this.dataGenerator.currentPage || this.currentPage,
    ];
    this.dataGeneratorFactoryOutputObserver =
      this.tableDataService.dataGeneratorFactoryObs(
        this.associationGroupService.fetchAssociationGroups(),
        groupTableHeader,
        this.formatTableRowsWithGroupData,
        this.itemsPerPage,
        prevCurrentPage,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        []
      );
    this.datageneratorSubscription =
      this.dataGeneratorFactoryOutputObserver.subscribe(
        (dataGeneratorFactoryOutput) => {
          this.dataGenerator = dataGeneratorFactoryOutput.dataGenerator;
          this.groupList = dataGeneratorFactoryOutput.tableRows as TableRow[];
          // this.users = dataGeneratorFactoryOutput.rawData as IUser[];
        }
      );
  }

  private async deleteGroup(uuid: string, name: string) {
    try {
      this.modalAlertService.hideModalAlert();
      await this.deleteGroupAPI(uuid);
      this.showNotification(
        'success',
        ``,
        `<strong>${name}</strong> has been removed.`,
        true
      );
    } catch (error) {
      this.showNotification(
        'error',
        `Delete group`,
        `couldn't be removed.`,
        true,
        null
      );
    }
  }

  private async deleteGroupAPI(uuid: string) {
    await this.associationGroupService.deleteAssociationGroup(uuid);
    this.refreshTableData();
  }

  private showNotification(
    type: 'success' | 'error',
    heading: string,
    message: string,
    autoDismiss: boolean,
    dismissButton: IBannerButton | null = {
      label: 'Dismiss',
      action: (bannerId: number) => this.bannerService.hideBanner(bannerId),
      style: 'secondary',
    }
  ) {
    this.bannerService.showBanner({
      type,
      heading,
      message,
      button: dismissButton,
      autoDismiss,
    });
  }
}
