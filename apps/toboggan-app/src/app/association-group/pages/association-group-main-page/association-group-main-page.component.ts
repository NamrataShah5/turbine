/* eslint-disable @typescript-eslint/no-empty-function */
import { Component } from '@angular/core';
import { IAssociationGroup } from '@toboggan-ws/toboggan-common';

export type associationGroupActionType = {
  group: IAssociationGroup | undefined;
  addUser: boolean;
};

@Component({
  selector: 'toboggan-ws-association-group-main-page',
  templateUrl: './association-group-main-page.component.html',
  styleUrls: ['./association-group-main-page.component.scss'],
})
export class AssociationGroupMainPageComponent {
  title = 'Create association group';
  showCreategroup = false;

  constructor() {}

  openCreateGroupModal() {
    this.showCreategroup = true;
  }

  handleGroupCreateAction() {
    this.showCreategroup = false;
  }

}
