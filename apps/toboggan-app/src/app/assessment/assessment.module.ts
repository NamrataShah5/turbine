import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SharedModule } from '../shared/shared.module';
import { assessmentRouting } from './assessment.routing';
import { AllEvaluationsListComponent } from './components/all-evaluations-list/all-evaluations-list.component';
import { AssessmentDetailsComponent } from './components/assessment-details/assessment-details.component';
import { AssessmentListComponent } from './components/assessment-list/assessment-list.component';
import { EvaluationBacklogComponent } from './components/evaluation-backlog/evaluation-backlog.component';
import { FlagAssessmentComponent } from './components/flag-assessment/flag-assessment.component';
import { MyEvaluationsListComponent } from './components/my-evaluations-list/my-evaluations-list.component';
import { AssessmentMainPageComponent } from './pages/assessment-main-page/assessment-main-page.component';
import { EvaluatedAssessmentsComponent } from './pages/evaluated-assessments/evaluated-assessments.component';

@NgModule({
  declarations: [
    AssessmentMainPageComponent,
    AssessmentListComponent,
    EvaluationBacklogComponent,
    FlagAssessmentComponent,
    AssessmentDetailsComponent,
    EvaluatedAssessmentsComponent,
    MyEvaluationsListComponent,
    AllEvaluationsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StoriesModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    SharedModule,
    CollapseModule.forRoot(),
    assessmentRouting,
  ],
  exports: [
    AssessmentMainPageComponent,
    AssessmentListComponent,
    EvaluationBacklogComponent,
  ],
})
export class AssessmentModule { }
