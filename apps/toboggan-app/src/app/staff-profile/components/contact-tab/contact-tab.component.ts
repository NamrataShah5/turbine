/* eslint-disable no-useless-escape */
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IStaffProfile } from '@toboggan-ws/toboggan-common';
import { FormError } from '@toboggan-ws/toboggan-constants';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { ModalAlertService } from '../../../shared/services/modal-alert/modal-alert.service';
import { StaffProfileService } from '../../services/staff-profile.service';

@Component({
  selector: 'toboggan-ws-contact-tab',
  templateUrl: './contact-tab.component.html',
  styleUrls: ['./contact-tab.component.scss']
})
export class ContactTabComponent implements OnChanges {
  @Input() profile = {} as IStaffProfile;

  editMode = false;

  toolTips = {
    phoneNumber: 'If you don’t want learners to have your personal phone number, you can generate a new number using a free online masking service and enter that here. Incoming calls or texts will still be routed to your personal phone number.',
  }

  contactDetailsForm: FormGroup = this.fb.group({
    email: [{ value: '', disabled: true }, [Validators.required]],
    inboxes: [{ value: '', disabled: true }, [Validators.required]],
    phoneNumber: ['', Validators.pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/)]
  });

  constructor(
    private fb: FormBuilder,
    private bannerService: BannerService,
    private staffService: StaffProfileService,
    private modalAlertService: ModalAlertService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['profile']) {
      this.setDetailsForm(changes['profile'].currentValue)
    }
  }

  setDetailsForm(profile: any) {
    const {
      email: email,
      phoneNumber: phoneNumber,
      inboxes: inboxes,
    } = profile;

    this.contactDetailsForm.patchValue({
      email,
      phoneNumber,
      inboxes
    });
  }


  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  openDiscardConfirmationModal() {
    this.modalAlertService.showModalAlert({
      type: 'warning',
      heading: `Leave this page?`,
      message: `If you leave, your changes won’t be saved. `,
      buttons: [
        {
          title: 'No, continue editing',
          onClick: () => {
            this.modalAlertService.hideModalAlert();
          },
          style: 'secondary',
        },
        {
          title: 'Yes, leave page',
          onClick: () => {
            this.modalAlertService.hideModalAlert();
            this.setDetailsForm(this.profile);
            this.editMode = !this.editMode;
          },
          style: 'primary',
        },
      ],
    });
  }

  getErrorMessage(controlName: string) {
    const control = this.contactDetailsForm.get(controlName);
    if (control)
      if (control.hasError('required')) {
        return `${FormError.empty}`;
      } else if (control.hasError('pattern')) {
        return 'Use this format: (###) ###-####';
      }
    return '';
  }


  hasError(controlName: string) {
    const control = this.contactDetailsForm.get(controlName);
    if (control) {
      return !control.valid && (control.dirty || control.touched);
    }
    return false;
  }

  async saveStaffProfile() {
    try {
      if (this.contactDetailsForm.valid) {
        const learnerProfile = this.contactDetailsForm.value;
        await this.staffService.updateProfile(this.profile.uuid, learnerProfile);
        // handle success
        this.bannerService.showBanner({
          type: 'success',
          heading: ``,
          message: `Your <strong>personal details</strong> have been saved.`,
          button: {
            label: 'Dismiss',
            action: (bannerId: number) => this.bannerService.hideBanner(bannerId),
          },
          autoDismiss: true,
        });
        this.editMode = false;
      }
    } catch (error) {
      this.bannerService.showBanner({
        type: 'error',
        heading: ``,
        message: `Changes to your <strong>Personal details</strong> couldn't be saved.`,
        button: null,
        autoDismiss: true
      });
      return false;
    }
    return true;
  }

}
