import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InterstitialLoaderType } from '@snhuproduct/toboggan-ui-components-library';
import { IAssessment } from '@toboggan-ws/toboggan-common';
import { FormError } from '@toboggan-ws/toboggan-constants';
import { AuthService } from '../../../shared/auth/auth.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { BannerService } from '../../../shared/services/banner/banner.service';
import {
  SubmittedAssessmentCommentType,
  SubmittedAssessmentStatus
} from '../../interface/assessments.type';
import { AssessmentService } from '../../services/assessment.service';
import { RowActions } from '../assessment-list/assessment-table.type';

@Component({
  selector: 'toboggan-ws-flag-assessment',
  templateUrl: './flag-assessment.component.html',
  styleUrls: ['./flag-assessment.component.scss'],
})
export class FlagAssessmentComponent implements AfterViewInit {
  @ViewChild('editflag') editFlagModal!: ModalComponent;
  @Output() editFlagAssessmentAction = new EventEmitter<string | undefined>();
  @Input() assessment!: IAssessment;
  @Input() selectedOption!: RowActions;

  editAssessmentForm: FormGroup = new FormGroup({
    comments: new FormControl('', [
      Validators.required,
      Validators.maxLength(300),
    ]),
  });
  isLoading = false;
  loaderType = InterstitialLoaderType.Large;
  constructor(
    private assessmentService: AssessmentService,
    private bannerService: BannerService,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    this.editFlagModal.open();
  }

  getErrorMessage(controlName: string) {
    const control = this.editAssessmentForm.get(controlName);
    if (control)
      if (control.hasError('required') || !control.value?.trim()) {
        return `${FormError.empty}`;
      } else if (control.hasError('maxlength')) {
        return 'Shorten the description';
      }
    return '';
  }

  hasError(controlName: string) {
    const control = this.editAssessmentForm.get(controlName);
    if (control) {
      return (
        (!control.valid && (control.dirty || control.touched)) ||
        (control.touched && !control.value?.trim())
      );
    }
    return false;
  }

  hideModal() {
    this.editFlagAssessmentAction.emit();
    this.editFlagModal.close();
  }

  get rowActions() {
    return RowActions;
  }

  get modalTitle() {
    if (this.selectedOption === RowActions.FlagForInstructorReview) {
      return 'Flag this submission?';
    }
    return 'Return submission without evaluating?';
  }

  get acceptButtonText() {
    if (this.selectedOption === RowActions.FlagForInstructorReview) {
      return 'Yes, flag';
    }
    return 'Yes, return it';
  }

  get placeHolderText() {
    if (this.selectedOption === RowActions.FlagForInstructorReview) {
      return `Tell the instructor why you're flagging this submission (i.e., documenting a potential academic honesty violation)`;
    }
    return `Tell the learner why you're flagging this submission (eg., wrong fil(s) submitted, minimun requirements not met, insufficient original work, number of allowed attempts exceeded)`;
  }

  get succesMessage() {
    if (this.selectedOption === RowActions.FlagForInstructorReview) {
      return `<strong>${this.assessment?.learnerName}</strong>'s submission has been flagged for the instructor to review.`;
    }
    return `<strong>${this.assessment?.learnerName}</strong>'s submission was returned without bieng evaluated. It has been removed from your evaluation list`;
  }

  get errorMessage() {
    if (this.selectedOption === RowActions.FlagForInstructorReview) {
      return `<strong>${this.assessment?.learnerName}</strong>'s couldn't be flagged.`;
    }
    return `<strong>${this.assessment?.learnerName}</strong>'s couldn't be returned as unevaluated.`;
  }

  get modalClassName() {
    return this.selectedOption === RowActions.FlagForInstructorReview
      ? ''
      : 'unevaluated-modal';
  }

  async updateAssessment() {
    this.editAssessmentForm.markAllAsTouched();
    if (
      this.editAssessmentForm.valid &&
      this.editAssessmentForm.value.comments?.trim()
    ) {
      try {
        this.isLoading = true;
        await this.processAssessment();
        this.editFlagAssessmentAction.emit(this.assessment.id);
        this.editFlagModal.close();
        this.bannerService.showBanner({
          type: 'success',
          heading: '',
          message: this.succesMessage,
          button: null,
          autoDismiss: true,
        });
        this.isLoading = false;
      } catch (error) {
        // handle error scenario
        this.isLoading = false;
        this.editFlagModal.modal?.content?.alertBanners.push({
          type: 'error',
          heading: '',
          message: this.errorMessage,
        });
        return false;
      }
    }
    return true;
  }

  async processAssessment() {
    const commentArray = this.assessment.comments ?? [];
    if (this.selectedOption === RowActions.FlagForInstructorReview) {
      const commentObject = {
        comment: this.editAssessmentForm.value.comments as string,
        type: SubmittedAssessmentCommentType.Flagged,
        access: 'instructor id for flagging will synced from backend', // instructor id for flagging will synced from backend once its done remove this field
        author: this.authService.currentUser.uid,
      };
      commentArray.push(commentObject);
      const body = {
        isFlagged: true,
        comments: commentArray,
      };
      await this.assessmentService.updateSubmittedAssessment(
        this.assessment.uuid,
        body
      );
      return;
    }
    const commentObject = {
      comment: this.editAssessmentForm.value.comments as string,
      type: SubmittedAssessmentCommentType.NonEvaluated,
      access: this.assessment.learnerId, // for non evaluated api give this as learner uuid
      author: this.authService.currentUser.uid,
    };
    commentArray.push(commentObject);
    const body = {
      status: SubmittedAssessmentStatus.NonEvaluated,
      comments: commentArray,
    };
    await this.assessmentService.updateSubmittedAssessment(
      this.assessment.uuid,
      body
    );
  }
}
