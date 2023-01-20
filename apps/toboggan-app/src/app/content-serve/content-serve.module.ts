import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ContentPreviewComponent } from './pages/content-preview/content-preview.component';
import { contentServeRouting } from './content-serve.routing';
import { ContentPlayerModule } from '@snhuproduct/content-player'

@NgModule({
  declarations: [
    ContentPreviewComponent,
  ],
  imports: [
    CommonModule,
    ContentPlayerModule,
    contentServeRouting,
    SharedModule,
  ],
})
export class ContentServeModule { }
