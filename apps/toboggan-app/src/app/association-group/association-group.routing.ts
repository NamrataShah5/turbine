import { RouterModule, Routes } from '@angular/router';
import { AssociationGroupDetailsPageComponent } from './pages/association-group-details-page/association-group-details-page.component';
import { AssociationGroupMainPageComponent } from './pages/association-group-main-page/association-group-main-page.component';

const associationGroupRoutes: Routes = [
  { path: '', component: AssociationGroupMainPageComponent },
  { path: 'details/:id', component: AssociationGroupDetailsPageComponent }
];

export const associationGroupRouting = RouterModule.forChild(associationGroupRoutes);
