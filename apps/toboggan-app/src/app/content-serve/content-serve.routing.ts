import { RouterModule, Routes } from '@angular/router';
import { ContentPreviewComponent } from './pages/content-preview/content-preview.component'

const contentServeRoutes: Routes = [{ path: 'preview/:id', component: ContentPreviewComponent }];

export const contentServeRouting = RouterModule.forChild(contentServeRoutes);
