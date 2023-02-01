import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAssociationGroup, IUser } from '@toboggan-ws/toboggan-common';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { UserService } from '../../../shared/services/user/user.service';
import { AssociationGroupService } from '../../services/association-group.service';

@Component({
  selector: 'toboggan-ws-add-new-instructor',
  templateUrl: './add-new-instructor.component.html',
  styleUrls: ['./add-new-instructor.component.scss'],
})
export class AddNewInstructorComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild('addInstructor') addInstructor!: ModalComponent;
  @Output() addUserToGroupAction = new EventEmitter<boolean | undefined>();
  @Input() group!: IAssociationGroup;
  addUserForm: FormGroup = new FormGroup({
    groupId: new FormControl(''),
    user: new FormControl('', [Validators.required]),
    status: new FormControl('Active', [Validators.required]),
    discipline: new FormControl('', [Validators.required]),
  });
  users: IUser[] = [];
  status: string[] = ['Active', 'Inactive'];
  discipline: string[] = ['Math', 'English', 'Humanities'];

  constructor(
    private userService: UserService,
    private groupService: AssociationGroupService,
    private bannerService: BannerService
  ) {}

  ngOnInit(): void {
    this.getInstructors();
  }
  ngOnChanges({ group }: SimpleChanges): void {
    if (group.currentValue && !group.previousValue) {
      this.addUserForm.patchValue({
        groupId: group.currentValue.id,
      });
    }
  }

  ngAfterViewInit(): void {
    this.addInstructor.open();
  }

  getInstructors(): void {
    this.userService.fetchUsers().subscribe((users: IUser[]) => {
      this.users = users;
    });
  }

  async addUsertoGroup() {
    this.addUserForm.markAllAsTouched();
    const user: IUser[] = this.users.filter((e) =>
      this.addUserForm.value.user.includes(e.email)
    );
    if (!user.length) {
      this.getFormError('user');
    }
    if (!this.status.includes(this.addUserForm.value.status)) {
      this.getFormError('status');
    }
    if (!this.discipline.includes(this.addUserForm.value.discipline)) {
      this.getFormError('discipline');
    }
    try {
      if (this.addUserForm.valid) {
        if (user.length) this.addUserToGroupAction.emit(true);
        // api call pending
        this.addInstructor.close();
        this.bannerService.showBanner({
          type: 'success',
          heading: '',
          message:
            user.length < 2
              ? `<strong>${user[0]?.firstName} ${user[0]?.lastName}</strong> has been added to <strong>Instructors</strong>.`
              : ` ${user.length} Users has been added to Instructors`,
          button: null,
          autoDismiss: true,
        });
      }
    } catch (error) {
      this.addInstructor.modal?.content?.alertBanners.push({
        type: 'error',
        heading: '',
        message: `<strong>${user
          .map((el: any) => el.firstName)
          .join(
            ''
          )} couldn’t be added to this group due to incorrect permissions.`,
      });
      return false;
    }
    return true;
  }

  hideModal() {
    this.addInstructor.close();
  }

  hasError(controlName: string) {
    const control = this.addUserForm.get(controlName);
    if (control) {
      if (controlName === 'user') {
        return (
          (!control.valid ||
            !this.users.some((e) => control?.value.includes(e.email))) &&
          (control.dirty || control.touched)
        );
      }
      if (controlName === 'discipline') {
        return (
          (!control.valid || !this.discipline.includes(control?.value)) &&
          (control.dirty || control.touched)
        );
      }
      if (controlName === 'status') {
        return (
          (!control.valid || !this.status.includes(control?.value)) &&
          (control.dirty || control.touched)
        );
      }
    }
    return false;
  }

  getFormError(field: string): string {
    const control = this.addUserForm.get(field);
    if (control?.hasError('required')) {
      return "This field can't be empty";
    }
    if (
      field === 'user' &&
      !this.users.some((e) => control?.value.includes(e.email))
    ) {
      return 'No user found with that user name';
    }
    if (field === 'status' && !this.status.includes(control?.value)) {
      return 'No status found with that status name';
    }
    if (field === 'discipline' && !this.discipline.includes(control?.value)) {
      return 'No discipline found with that discipline name';
    }
    return '';
  }
}
