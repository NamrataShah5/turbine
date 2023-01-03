import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffProfileMainPageComponent } from './pages/staff-profile-main-page/staff-profile-main-page.component';

const routes: Routes = [{ path: '', component: StaffProfileMainPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffProfileRoutingModule { }
