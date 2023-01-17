import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule, Routes } from '@angular/router';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { SharedModule } from '../shared/shared.module';
import { CurriculumPathwayComponent } from './components/curriculum-pathway/curriculum-pathway.component';
import { ContentManagementMainPageComponent } from './pages/content-management-main-page/content-management-main-page.component';

const contentManagementRoutes: Routes = [
  { path: '', component: ContentManagementMainPageComponent },
];

@NgModule({
  declarations: [
    ContentManagementMainPageComponent,
    CurriculumPathwayComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(contentManagementRoutes),
    MatTreeModule,
    MatIconModule,
    CdkTreeModule,
    StoriesModule,
    SharedModule,
  ],
})
export class ContentManagementModule {}
