import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContentSelectionService } from '../../services/content-selection.service';

@Component({
  selector: 'toboggan-ws-content-preview-button',
  templateUrl: './content-preview-button.component.html',
  styleUrls: ['./content-preview-button.component.scss'],
})
export class ContentPreviewButtonComponent{
  constructor(private contentSelectionService: ContentSelectionService, private router: Router) {}

  previewSelectedContent(){
    const id = this.contentSelectionService.selectedContentId;
    if(!id){
      alert('No content is currently selected');
    }
    const url = this.router.serializeUrl(this.router.createUrlTree([`/content-serve/preview/${id}`]));
    window.open(url, '_blank'); //open in a new tab
  }
}
