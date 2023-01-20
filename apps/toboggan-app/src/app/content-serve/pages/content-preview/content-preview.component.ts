import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerHostComponent } from '@snhuproduct/content-player';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'toboggan-ws-content-preview',
  templateUrl: './content-preview.component.html',
  styleUrls: ['./content-preview.component.scss'],
})
export class ContentPreviewComponent implements AfterViewInit {
  contentId: string | undefined | null;
  isError = false;

  @ViewChild(PlayerHostComponent) playerHost!: PlayerHostComponent;

  constructor(private activatedRoute: ActivatedRoute, private contentService: ContentService) {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.contentId = paramMap.get('id');
    });
  }

  ngAfterViewInit(): void {
      if (this.contentId) {
        this.playContent(this.contentId);
      } else {
        this.playerHost?.resetPlayer();
      }
  }

  async playContent(uuid: string) {
    this.isError = false;
    let content;

    if(!this.playerHost){
      console.log('Player host is not created');
      this.isError = true;
      return;
    }

    try {
      content = await this.contentService.getSignedUrl(uuid);
    } catch (error) {
      this.isError = true;
      console.log('Failed to retrive content', uuid, error);
    }

    if (!content) {
      this.playerHost.resetPlayer();
      return;
    }

    if (content.resource_type === 'video') {
      this.playerHost.playVideo(content.signed_url);
    } else if (
      content.resource_type === 'html package' ||
      content.resource_type === 'html_package'
    ) {
      this.playerHost.renderHtmlPackage(content.signed_url);
    } else if (content.resource_type === 'html') {
      try {
        //download content for a standalone html to render it inside the DOM
        const response = await this.contentService.downloadContent(uuid);
        this.playerHost.renderHtml(response);
      } catch (error) {
        //fallback to render it in iframe as an html package
        this.playerHost.renderHtmlPackage(content.signed_url);
      }
    } else {
      this.playerHost.resetPlayer();
      console.log('unknown resouce type:' + content.resource_type);
      this.isError = true;
    }
  }
}
