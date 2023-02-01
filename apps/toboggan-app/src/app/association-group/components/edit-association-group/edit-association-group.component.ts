import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InterstitialLoaderType } from '@snhuproduct/toboggan-ui-components-library';
import { IAssociationGroup } from '@toboggan-ws/toboggan-common';
import { FormError } from '@toboggan-ws/toboggan-constants';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { AssociationGroupService } from '../../services/association-group.service';

@Component({
  selector: 'toboggan-ws-edit-association-group',
  templateUrl: './edit-association-group.component.html',
  styleUrls: ['./edit-association-group.component.scss'],
  providers: [SafeHtmlPipe],
})
export class EditAssociationGroupComponent implements OnChanges {
  @Input() mode = 'edit';
  @Input() group: IAssociationGroup = {} as IAssociationGroup;
  @Input() oldGroup: IAssociationGroup = {} as IAssociationGroup;
  @ViewChild('edit') editModal!: ModalComponent;
  reviewing?: Partial<IAssociationGroup> | null = null;
  isLoading = false;
  loaderType = InterstitialLoaderType.Large;
  editGroupForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9 ]*$'),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
      this.specialCharactersValidation,
    ]),
  });
  constructor(
    private associationGroupService: AssociationGroupService,
    private bannerService: BannerService,
    private safeHtmlPipe: SafeHtmlPipe
  ) {}

  ngOnChanges({ group }: SimpleChanges): void {
    if (group.currentValue && !group.previousValue) {
      this.editGroupForm.patchValue({
        name: group.currentValue.name,
        description: group.currentValue.description,
      });
      this.oldGroup = group.currentValue;
    }
  }
  ngAfterViewInit(): void {
    if (this.group) this.editModal?.open();
  }

  getErrorMessage(controlName: string) {
    const control = this.editGroupForm.get(controlName);
    if (control)
      if (control.hasError('required')) {
        return `${FormError.empty}`;
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
    const control = this.editGroupForm.get(controlName);
    if (control) {
      return !control.valid && (control.dirty || control.touched);
    }
    return false;
  }

  editModalHidden() {
    this.editGroupForm.reset();
    this.associationGroupService.publishGroupCompleted(
      this.group as IAssociationGroup
    );
  }

  async approveChanges() {
    if (this.editGroupForm.valid) {
      this.editGroupForm.markAllAsTouched();
      const group: Partial<IAssociationGroup> = {
        name: this.editGroupForm.value.name as string,
        description: this.editGroupForm.value.description as string,
      };
      try {
        this.isLoading = true;
        // commenting till api end points are ready
        // await this.associationGroupService.updateGroup(
        //   group,
        //   this.group.uuid
        // );
        // handle success
        this.bannerService.showBanner({
          type: 'success',
          heading: ``,
          message: `The <strong>${group.name}</strong> user group's details have been edited.`,
          button: {
            label: 'Dismiss',
            action: (bannerId: number) =>
              this.bannerService.hideBanner(bannerId),
          },
          autoDismiss: true,
        });
        this.editModal.close();
        this.associationGroupService.publishGroupCompleted(
          group as IAssociationGroup
        );
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.editModal.modal?.content?.alertBanners.push({
          type: 'error',
          heading: 'Create Group',
          message: "<b>Edit group details</b> couldn't be completed.`",
        });
        return false;
      }
      return true;
    } else {
      return false;
    }
  }
}
