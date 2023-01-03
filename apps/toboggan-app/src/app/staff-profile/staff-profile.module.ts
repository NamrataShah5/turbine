import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SharedModule } from '../shared/shared.module';
import { ContactTabComponent } from './components/contact-tab/contact-tab.component';
import { PersonalTabComponent } from './components/personal-tab/personal-tab.component';
import { StaffProfileMainPageComponent } from './pages/staff-profile-main-page/staff-profile-main-page.component';
import { StaffProfileRoutingModule } from './staff-profile-routing.module';


@NgModule({
  declarations: [
    StaffProfileMainPageComponent,
    PersonalTabComponent,
    ContactTabComponent
  ],
  imports: [
    CommonModule,
    StaffProfileRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StoriesModule,
    CollapseModule.forRoot()
  ],
  exports: [
    StaffProfileMainPageComponent,
    PersonalTabComponent,
    ContactTabComponent]
})
export class StaffProfileModule { }
