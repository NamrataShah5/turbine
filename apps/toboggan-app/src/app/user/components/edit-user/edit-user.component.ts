import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { InterstitialLoaderType } from '@snhuproduct/toboggan-ui-components-library';
import { IGroup, IUser } from '@toboggan-ws/toboggan-common';
import { ValidatorPattern } from '@toboggan-ws/toboggan-constants';
import * as R from 'ramda';
import { GroupService } from '../../../group/services/group.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { ModalCancelApiService } from '../../../shared/services/cancel-api/cancel-api.service';
import { UserService } from '../../../shared/services/user/user.service';

@Component({
  selector: 'toboggan-ws-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnChanges, OnDestroy {
  constructor(
    public userService: UserService,
    private bannerService: BannerService,
    public modalCancelApiService: ModalCancelApiService,
    private groupService: GroupService
  ) {
    this.groupService.fetchGroups().subscribe((response) => {
      this.userGroups = response;
    });
  }
  isLoading = false;
  reviewing?: Partial<IUser> | null = null;
  loaderType = InterstitialLoaderType.Large;
  @ViewChild('edit') editModal!: ModalComponent;
  @ViewChild('review') reviewModal!: ModalComponent;
  @Input() user?: IUser;
  @Output() userChange = new EventEmitter<IUser | undefined>();
  userGroups!: IGroup[];
  approveChanges = [] as any;

  userForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern(ValidatorPattern.nameValidation),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern(ValidatorPattern.nameValidation),
    ]),
    email: new FormControl('', [Validators.required, Validators.pattern(ValidatorPattern.emailValidation)]),
    userGroups: new FormArray([]),
  });

  ngOnChanges({ user }: SimpleChanges): void {
    if (user.currentValue && !user.previousValue) {
      this.editModal?.open();
      this.userForm.patchValue({
        firstName: user.currentValue.firstName,
        lastName: user.currentValue.lastName,
        email: user.currentValue.email
      });

      const groups: FormArray = this.userForm.get('userGroups') as FormArray;
      groups.clear();
      user.currentValue.userGroups.forEach((item: any) => {
        groups.push(new FormControl(item));
      });
    }
  }

  editModalHidden() {
    if (!this.reviewing) {
      this.userChange.emit();
      this.userForm.reset();
    }
  }

  checkboxCheck(uuid: string) {
    if (this.user) {
      const find = this.user.userGroups?.find((id) => id === uuid);
      if (find) { return true; }
    }
    return false;
  }

  editModalAccept() {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      const reviewing = this.userForm.getRawValue();
      if (!R.equals(R.pick(R.keys(reviewing), this.user), reviewing)) {
        this.reviewing = this.userForm.getRawValue();
        this.editModal.close();
        if (this.reviewing && this.user) {
          const reviewingUserGroups: (string | undefined)[] = [];
          const userUserGroups: (string | undefined)[] = [];
          this.reviewing.userGroups?.forEach((item: any) => {
            const userGroup = this.userGroups.find((group) => group.uuid == item);
            reviewingUserGroups.push(userGroup?.name)
          });
          this.user.userGroups?.forEach((item: any) => {
            const userGroup = this.userGroups.find((group) => group.uuid == item);
            userUserGroups.push(userGroup?.name)
          });

          this.approveChanges = [
            {
              label: 'Last Name',
              newValue: this.reviewing.lastName,
              oldValue: this.user.lastName,
            },
            {
              label: 'First Name',
              newValue: this.reviewing.firstName,
              oldValue: this.user.firstName,
            },
            {
              label: 'Email',
              newValue: this.reviewing.email,
              oldValue: this.user.email,
            },
            {
              label: 'Group(s)',
              newValue: reviewingUserGroups.toString(),
              oldValue: userUserGroups.toString(),
            },
          ]
        }
        this.reviewModal.open();
      }
    }
  }

  reviewModalHidden() {
    if (this.reviewing) {
      this.reviewing = null;
      setTimeout(() => {
        this.editModal.open();
      }, 200);
    }
  }

  handleModalLoaderCancel() {
    this.modalCancelApiService.show().subscribe(() => {
      this.userService.unsubscibeUsersApi();
    });
  }

  onCheckboxToggle(e: any) {
    const groups: FormArray = this.userForm.get('userGroups') as FormArray;
    if (e.target.checked) {
      const userGroup = this.userGroups.find(
        (group) => group.uuid == e.target.value
      );
      groups.push(new FormControl(userGroup?.uuid));
    } else {
      let i = 0;
      groups.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          groups.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  async onSubmit() {
    try {
      if (this.user) {
        const userObj = { ...this.userForm.getRawValue() as unknown as IUser, userType: this.user.userType };
        this.isLoading = true;

        await this.userService.updateUser(userObj, this.user?.userId);

        this.bannerService.showBanner({
          type: 'success',
          heading: ``,
          message: `<b>${userObj.firstName} ${userObj.lastName}</b>'s user details have been edited.`,
          button: {
            label: 'Dismiss',
            action: (bannerId: number) =>
              this.bannerService.hideBanner(bannerId),
          },
          autoDismiss: true,
        });
      }
    } catch (error) {
      this.bannerService.showBanner({
        type: 'error',
        heading: ``,
        message: `<b>Edit user</b> couldn't be completed.`,
        autoDismiss: true,
      });

      return false;
    } finally {
      this.reviewing = null;
      this.reviewModal.close();
      this.userChange.emit();
      this.userService.publishUserEditComplete(this.user as IUser);
      this.isLoading = false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.reviewing = undefined;
    this.user = undefined;
    this.userForm.reset();
  }
}
