import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  JSONObject,
  SingleHeaderRowTableDataGenerator,
  TableDataGenerator,
  TableRow,
} from '@snhuproduct/toboggan-ui-components-library';
import { IRowActionEvent } from '@snhuproduct/toboggan-ui-components-library/lib/table/row-action-event.interface';
import {
  IAssociationGroup,
  IUpdatedUser,
  IUser,
} from '@toboggan-ws/toboggan-common';
import { Observable, Subscription } from 'rxjs';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { IBannerButton } from '../../../shared/services/banner/banner.types';
import { ModalAlertService } from '../../../shared/services/modal-alert/modal-alert.service';
import {
  ITableDataGeneratorFactoryOutput,
  ITableRowFilterFunc,
  TableDataService,
} from '../../../shared/services/table-data/table-data.service';
import { UserService } from '../../../shared/services/user/user.service';
import {
  ICellRowData,
  IFilterChange,
} from '../../../user/components/user-table/user-table.types';
import { AssociationGroupService } from '../../services/association-group.service';
import { RowActions } from './learner-list.type';
import { learnerTableHeader } from './learner-table-header';
type UserStatusPayload = Omit<IUpdatedUser, 'id'>;
@Component({
  selector: 'toboggan-ws-learner-list',
  templateUrl: './learner-list.component.html',
  styleUrls: ['./learner-list.component.scss'],
})
export class LearnerListComponent implements OnInit, OnDestroy {
  private currentPage = 1;
  private resultsPerPage = 10;
  itemName = 'learners';
  dataGenerator: SingleHeaderRowTableDataGenerator = {} as TableDataGenerator;
  private dataGeneratorFactoryOutputObserver: Observable<ITableDataGeneratorFactoryOutput> =
    {} as Observable<ITableDataGeneratorFactoryOutput>;
  private datageneratorSubscription: Subscription = {} as Subscription;
  private dataGenFactoryOutput: ITableDataGeneratorFactoryOutput = {
    dataGenerator: this.dataGenerator,
    tableRows: [],
    rawData: [],
  };
  private filters: Map<string, Record<string, boolean>> = new Map();
  private filterFuncs: { [key: string]: ITableRowFilterFunc } = {
    status: (tr: TableRow, columnMetadata = learnerTableHeader) => {
      const isInvalid = !(
        columnMetadata[columnMetadata.length - 1].selectedFilters.Active ^
        columnMetadata[columnMetadata.length - 1].selectedFilters.Inactive
      );
      const filterStatusStr = columnMetadata[columnMetadata.length - 1]
        .selectedFilters.Active
        ? 'Active'
        : 'Inactive';
      const rowUserStatus = tr.cellData['status'] as Array<unknown>;
      return isInvalid || filterStatusStr === rowUserStatus[1];
    },
  };

  @Input() group: IAssociationGroup = {} as IAssociationGroup;

  constructor(
    private modalAlertService: ModalAlertService,
    private bannerService: BannerService,
    private associationGroupService: AssociationGroupService,
    private tableDataService: TableDataService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.refreshTableData();
  }

  ngOnDestroy(): void {
    this.datageneratorSubscription.unsubscribe();
  }
  getActionMenuItems(rowData: TableRow) {
    const cellData = rowData.cellData as Record<string, JSONObject>;
    const actions: string[] = [RowActions.Remove];
    if (cellData['status'][1]?.toString().toLowerCase() === 'active') {
      actions.push(RowActions.Deactivate);
    } else {
      actions.push(RowActions.Activate);
    }
    return actions;
  }

  onRowAction(event: IRowActionEvent) {
    const { action, rowId } = event;
    const rowData: any = this.dataGenerator.rowData.find(
      (row) => row.rowId === rowId
    );

    if (!rowData) {
      throw new Error('Could not find rowData for rowId: ' + rowId);
    }
    const { first, last, mail } = rowData.cellData as unknown as ICellRowData;
    const userId = rowData.id;
    const user = this.getAllUsers()?.find((user) => user?.userId === userId);
    console.log(mail, user, rowData.cellData, rowData);
    const userPayload: UserStatusPayload = {
      firstName: first,
      lastName: last,
      email: mail[0],
      userType: user?.userType,
    };
    switch (action) {
      case RowActions.Remove:
        this.openRemoveUserConfirmation(user);
        break;
      case RowActions.Activate:
        this.activateUser(userId, userPayload);
        break;
      case RowActions.Deactivate:
        this.deactivateUser(userId, userPayload);
        break;
    }
  }
  getAllUsers(): IUser[] {
    return this.dataGenFactoryOutput.rawData as IUser[];
  }

  activateUser(id: string, userPayload: UserStatusPayload) {
    this.modalAlertService.showModalAlert({
      type: 'warning',
      heading: 'Activate this user?',
      message: `If you activate ${userPayload.firstName} ${userPayload.lastName}, they’ll be associated with the coach(es)/instructor(s) in this group`,
      buttons: [
        {
          title: 'No, cancel',
          onClick: () => {
            this.modalAlertService.hideModalAlert();
          },
          style: 'secondary',
        },
        {
          title: 'Yes, activate',
          onClick: async () => {
            try {
              this.modalAlertService.hideModalAlert();
              await this.toggleUserStatus('active', id);

              this.showNotification(
                'success',
                `${userPayload.firstName} ${userPayload.lastName}`,
                `'s status has been changed to active`,
                true
              );
            } catch (error) {
              this.showNotification(
                'error',
                `${userPayload.firstName} ${userPayload.lastName}`,
                `'s status couldn’t be changed.`,
                true,
                null
              );
            }
          },
          style: 'primary',
        },
      ],
    });
  }

  deactivateUser(id: string, userPayload: UserStatusPayload) {
    this.modalAlertService.showModalAlert({
      type: 'warning',
      heading: 'Deactivate this user?',
      message: `If you deactivate ${userPayload.firstName} ${userPayload.lastName}, they’ll no longer be associated with the coach(es)/instructor(s) in this group. This action is reversible.`,
      buttons: [
        {
          title: 'No, keep active',
          onClick: () => {
            this.modalAlertService.hideModalAlert();
          },
          style: 'secondary',
        },
        {
          title: 'Yes, deactivate',
          onClick: async () => {
            try {
              this.modalAlertService.hideModalAlert();
              await this.toggleUserStatus('inactive', id);

              this.showNotification(
                'success',
                `${userPayload.firstName} ${userPayload.lastName}`,
                `'s status has been changed to inactive.`,
                true
              );
            } catch (error) {
              this.showNotification(
                'error',
                `${userPayload.firstName} ${userPayload.lastName}`,
                `'s status couldn’t be changed.`,
                true,
                null
              );
            }
          },
          style: 'primary',
        },
      ],
    });
  }

  private async toggleUserStatus(
    status: 'active' | 'inactive',
    userId: string
  ) {
    // commenting till api end points are ready
    // await this.userService.updateUserStatus(
    //   {
    //     status: status,
    //   },
    //   userId
    // );
    this.applyActiveFilters();
  }

  public onFilterChange(event: IFilterChange): void {
    if (Object.values(event.filters).every((value) => !value)) {
      this.filters.delete(event.columnMetadatum.dataKey);
    }
    this.filters.set(event.columnMetadatum.dataKey, event.filters);
    this.applyActiveFilters();
  }
  openRemoveUserConfirmation(user: any) {
    const { firstName: firstName, lastName: lastName } = user;
    const userName = firstName + ' ' + lastName;
    this.modalAlertService.showModalAlert({
      type: 'warning',
      heading: `Remove user from this group?`,
      message: `If you remove <strong>${userName}</strong>, they’ll no longer be associated with the coach(es)/instructor(s) in this group. 
      This does not remove the user from the system and they can be added back to this group at any time.`,
      buttons: [
        {
          title: 'No, go back',
          onClick: () => {
            this.modalAlertService.hideModalAlert();
          },
          style: 'secondary',
        },
        {
          title: 'Yes, remove user',
          onClick: () => {
            this.removeUser(user);
          },
          style: 'primary',
        },
      ],
    });
  }
  private applyActiveFilters() {
    const additionalFilterFuncs: ITableRowFilterFunc[] = [];
    this.filters.forEach((_, key) => {
      additionalFilterFuncs.push(this.filterFuncs[key]);
    });
    this.refreshTableData(additionalFilterFuncs);
  }

  async removeUser(user: any) {
    const { firstName: firstName, lastName: lastName } = user;
    const { name: groupName } = this.group;
    const userName = firstName + ' ' + lastName;
    try {
      this.modalAlertService.hideModalAlert();
      await this.removeUserFromGroupAPI(user);
      this.refreshTableData();
      this.showNotification(
        'success',
        ``,
        `<strong>${userName}</strong> has been removed from <strong>${groupName}</strong>.`,
        true
      );
    } catch (error) {
      this.showNotification(
        'error',
        userName,
        `couldn’t be removed from this group.`,
        true,
        null
      );
    }
  }

  private async removeUserFromGroupAPI(user: IUser) {
    // if group does not have the user
    if (
      !this.group.members?.length ||
      !this.group.members.includes(user.userId)
    ) {
      return;
    }
    const members = this.group.members?.filter((item) => item !== user.userId);
    const body = {
      name: this.group.name,
      description: this.group.description,
      members: members,
    } as Partial<IAssociationGroup>;
    // commenting till api end points are ready
    // await this.associationGroupService.updateGroup(body, this.group.uuid);
  }

  private refreshTableData(
    additionalFilterFuncs: ITableRowFilterFunc[] = []
  ): void {
    // unsub if the subscription object is valid/there is an active subscription to prevent memory leak
    if (this.datageneratorSubscription.unsubscribe) {
      this.datageneratorSubscription.unsubscribe();
    }
    const [prevCurrentPage] = [
      this.dataGenerator.currentPage || this.currentPage, //prevCurrentPage
    ];
    this.dataGeneratorFactoryOutputObserver =
      this.tableDataService.dataGeneratorFactoryObs(
        this.associationGroupService.getLearnerByGroup('1'), // for development purpose
        learnerTableHeader,
        this.formatTableRowsWithUserData,
        this.resultsPerPage,
        prevCurrentPage,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        additionalFilterFuncs
      );
    this.datageneratorSubscription =
      this.dataGeneratorFactoryOutputObserver.subscribe(
        (dataGeneratorFactoryOutput: any) => {
          this.dataGenFactoryOutput = dataGeneratorFactoryOutput;
          this.dataGenerator = this.dataGenFactoryOutput.dataGenerator;
        }
      );
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

  formatTableRowsWithUserData(fetchedData: unknown): TableRow[] {
    const users = fetchedData as IUser[];
    // TODO: Ideally it should come sorted from our API!
    const usersSortedByLastName = users.sort((a, b) => {
      if (a.lastName && b.lastName) {
        if (a.lastName < b.lastName) {
          return -1;
        }
        if (a.lastName > b.lastName) {
          return 1;
        }
      }

      return 0;
    });

    const data = usersSortedByLastName.map((user, index) => {
      return {
        rowId: String(index + 1),
        id: user.userId,
        cellData: {
          first: user.firstName,
          last: user.lastName,
          status:
            user.status == 'active'
              ? ['is-category', 'Active', 50] // this will generate the custom tag
              : ['is-category', 'Inactive', 50],
          userId: user.userId,
          mail: ['gp-icon-mail', user.email],
        },
      };
    });
    return data as TableRow[];
  }
}
