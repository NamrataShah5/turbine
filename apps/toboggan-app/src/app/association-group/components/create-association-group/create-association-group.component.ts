import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAssociationGroup } from '@toboggan-ws/toboggan-common';
import { FormError } from '@toboggan-ws/toboggan-constants';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { IBannerButton } from '../../../shared/services/banner/banner.types';
import { associationGroupActionType } from '../../pages/association-group-main-page/association-group-main-page.component';
import { AssociationGroupService } from '../../services/association-group.service';

@Component({
  selector: 'toboggan-ws-create-association-group',
  templateUrl: './create-association-group.component.html',
  styleUrls: ['./create-association-group.component.scss'],
})
export class CreateAssociationGroupComponent implements OnInit, AfterViewInit {
  @ViewChild('createGroupModal') createGroupModal!: ModalComponent;
  @Output() groupCreateAction = new EventEmitter<associationGroupActionType>();
  createGroupForm!: FormGroup;
  constructor(
    private groupService: AssociationGroupService,
    private bannerService: BannerService
  ) {}

  ngOnInit(): void {
    this.createGroupForm = new FormGroup({
      groupType: new FormControl('',
        [Validators.required]),
      name: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9 ]*$'),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(300),
        this.specialCharactersValidation,
      ]),
      addUser: new FormControl(false),
    });
  }

  ngAfterViewInit(): void {
    this.createGroupModal.open();
  }

  getErrorMessage(controlName: string) {
    const control = this.createGroupForm.get(controlName);
    if (control)
      if (control.hasError('required')) {
        if(controlName === 'groupType'){
          return 'Make a selection';
        }else{
          return `${FormError.empty}`;
        }
      } else if (control.hasError('specialCharacters')) {
        return `${FormError.characters} ! @ # $`;
      } else if (control.hasError('pattern')) {
        return `${FormError.lettersAndNumbers}`;
      } else if (control.hasError('maxlength')) {
        return 'Shorten the description';
      }
    return '';
  }

  specialCharactersValidation(control: FormControl) {
    const value = control.value;
    const spChars = /[!@#$]+/;
    if (spChars.test(value)) {
      return {
        specialCharacters: {
          errors: true,
        },
      };
    }
    return null;
  }

  hasError(controlName: string) {
    const control = this.createGroupForm.get(controlName);
    if (control) {
      return !control.valid && (control.dirty || control.touched);
    }
    return false;
  }

  async createGroup() {
    this.createGroupForm.markAllAsTouched();
    if (this.createGroupForm.valid) {
      const group: Partial<IAssociationGroup> = {
        type: this.createGroupForm.value.groupType,
        name: this.createGroupForm.value.name,
        description: this.createGroupForm.value.description,
      };
      try{
        const newGroup = await this.groupService.createAssociationGroup(group);
        this.groupCreateAction.emit({
          group: newGroup,
          addUser: this.createGroupForm.value?.addUser,
        });
        this.createGroupModal.close();
        this.groupService.publishGroupCompleted(newGroup);
        this.bannerService.showBanner({
          type: 'success',
          heading: '',
          message: `The <strong>${newGroup.name}</strong> association group has been created.`,
          button: null,
          autoDismiss: true,
        });
      }
      catch(error){
          // handle error scenario
          console.log(error);
          this.createGroupModal.modal?.content?.alertBanners.push({
            type: 'error',
            heading: 'Create association group',
            message: "couldn't be completed.",
          });
      }
    }
    return false;
  }

  hideModal() {
    this.createGroupModal.close();
    this.groupCreateAction.emit();
  }

  private showSuccessNotification(
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
      type: 'success',
      heading,
      message,
      button: dismissButton,
      autoDismiss,
    });
  }
}
