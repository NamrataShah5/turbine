import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAssociationGroup } from '@toboggan-ws/toboggan-common';
import { Subscription } from 'rxjs';
import { AssociationGroupService } from '../../services/association-group.service';

@Component({
  selector: 'toboggan-ws-association-group-details-page',
  templateUrl: './association-group-details-page.component.html',
  styleUrls: ['./association-group-details-page.component.scss'],
})
export class AssociationGroupDetailsPageComponent implements OnInit, OnDestroy {
  associationGroup!: IAssociationGroup;
  id!: string;
  showAddUserModal = false;
  showAddInstructorModal = false;
  showEditGroupModal = false;
  showAddCoachModal = false;
  private updateGroupSubscription: Subscription = {} as Subscription;
  constructor(
    private route: ActivatedRoute,
    private associationGroupService: AssociationGroupService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.associationGroupService.groupUpdated$) {
      this.updateGroupSubscription =
        this.associationGroupService.groupUpdated$.subscribe(() => {
          this.showEditGroupModal = false;
          this.showAddUserModal = false;
          this.showAddInstructorModal = false;
          this.showAddCoachModal = false;
          this.getGroupDetails(); // for development purpose, will move this logic once api's are completed
        });
    }
  }

  getGroupDetails(): void {
    this.associationGroupService
      .fetchAssociationGroupDetails('A9J73RHTUfMWcwXx9XRE') // hardcoded for development purpose
      .subscribe((associationGroup: IAssociationGroup) => {
        this.associationGroup = associationGroup;
      });
  }

  openAddUserToGroupModal() {
    this.showAddUserModal = true;
  }

  handleAddUserToGroupAction() {
    this.showAddUserModal = false;
  }

  editGroupDetails() {
    this.showEditGroupModal = true;
  }
  ngOnDestroy(): void {
    this.updateGroupSubscription.unsubscribe();
  }

  openAddInstructorsToGroupModal() {
    this.showAddInstructorModal = true;
  }
  handleAddInstructorToGroupAction() {
    this.showAddInstructorModal = false;
  }

  openAddCoachesToGroupModal() {
    this.showAddCoachModal = true;
  }
  handleAddCoachesToGroupAction() {
    this.showAddCoachModal = false;
  }
}
