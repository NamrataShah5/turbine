import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SharedModule } from '../shared/shared.module';
import { associationGroupRouting } from './association-group.routing';
import { AddNewInstructorComponent } from './components/add-new-instructor/add-new-instructor.component';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';
import { AssociationGroupListComponent } from './components/association-group-list/association-group-list.component';
import { CoachListComponent } from './components/coach-list/coach-list.component';
import { CreateAssociationGroupComponent } from './components/create-association-group/create-association-group.component';
import { EditAssociationGroupComponent } from './components/edit-association-group/edit-association-group.component';
import { InstructorListComponent } from './components/instructor-list/instructor-list.component';
import { LearnerListComponent } from './components/learner-list/learner-list.component';
import { AssociationGroupDetailsPageComponent } from './pages/association-group-details-page/association-group-details-page.component';
import { AssociationGroupMainPageComponent } from './pages/association-group-main-page/association-group-main-page.component';

@NgModule({
  declarations: [
    AssociationGroupMainPageComponent,
    AssociationGroupDetailsPageComponent,
    LearnerListComponent,
    InstructorListComponent,
    EditAssociationGroupComponent,
    CoachListComponent,
    AddNewUserComponent,
    AddNewInstructorComponent,
    AssociationGroupListComponent,
    CreateAssociationGroupComponent,  
  ],
  imports: [
    CommonModule,
    FormsModule,
    StoriesModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    SharedModule,
    CollapseModule.forRoot(),
    associationGroupRouting,
  ],
  exports: [],
})
export class AssociationGroupModule {}
