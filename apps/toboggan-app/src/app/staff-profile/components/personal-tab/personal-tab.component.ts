import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IStaffProfile } from '@toboggan-ws/toboggan-common';
import { FormError } from '@toboggan-ws/toboggan-constants';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { ModalAlertService } from '../../../shared/services/modal-alert/modal-alert.service';
import { StaffProfileService } from '../../services/staff-profile.service';

@Component({
  selector: 'toboggan-ws-personal-tab',
  templateUrl: './personal-tab.component.html',
  styleUrls: ['./personal-tab.component.scss']
})
export class PersonalTabComponent implements OnChanges {
  @Input() profile = {} as IStaffProfile;

  editMode = false;
  isExpanded = false;
  pronouns = [
    'he/him/his',
    'she/her/hers',
    'they/them/theirs',
    'ze/hir/hirs',
    'xe/xem/xyr/xyrs',
    'Use my name',
    'None of these',
  ];

  toolTips = {
    preferredName: 'This could be a nickname or another name that you prefer.',
    preferredPronoun: 'If you want your pronouns to be displayed to others, select them here.',
    bio: 'Some ideas to get you started: your degree(s), the school(s) you attended, where you live, and your occupation (if not a full-time instructor). Be sure to include a few personal details too, like your adorable pets.'
  }

  personalDetailsForm: FormGroup = this.fb.group({
    firstName: [{ value: '', disabled: true }, [Validators.required]],
    lastName: [{ value: '', disabled: true }, [Validators.required]],
    preferredName: ['', [Validators.required]],
    preferredPronoun: [''],
    bio: ['', [Validators.required, Validators.maxLength(500)]]
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
      firstName: firstName,
      lastName: lastName,
      preferredName: preferredName,
      preferredPronoun: preferredPronoun,
      bio: bio
    } = profile;

    this.personalDetailsForm.patchValue({
      firstName,
      lastName,
      preferredName,
      preferredPronoun,
      bio
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  toggleMorePronouns() {
    this.isExpanded = !this.isExpanded;
  }

  getErrorMessage(controlName: string) {
    const control = this.personalDetailsForm.get(controlName);
    if (control)
      if (control.hasError('required')) {
        return `${FormError.empty}`;
      } else if (control.hasError('maxlength')) {
        return 'Shorten the description';
      }
    return '';
  }


  hasError(controlName: string) {
    const control = this.personalDetailsForm.get(controlName);
    if (control) {
      return !control.valid && (control.dirty || control.touched);
    }
    return false;
  }


  selectPronoun(pronoun: string) {
    this.personalDetailsForm.patchValue({
      preferredPronoun: pronoun
    });
    this.isExpanded = !this.isExpanded;
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

  async saveStaffProfile() {
    try {
      if (this.personalDetailsForm.valid) {
        const staffProfile = this.personalDetailsForm.value;
        await this.staffService.updateProfile(this.profile.uuid, staffProfile);
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
