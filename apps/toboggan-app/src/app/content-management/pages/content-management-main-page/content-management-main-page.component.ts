import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPathwayData, IPathwayNode } from '@toboggan-ws/toboggan-common';
import { ContentManagmentService } from '../../services/content-managment.service';

@Component({
  selector: 'toboggan-ws-content-management-main-page',
  templateUrl: './content-management-main-page.component.html',
  styleUrls: ['./content-management-main-page.component.scss'],
})
export class ContentManagementMainPageComponent implements OnInit {
  id: string;
  curriculumPathway!: IPathwayNode[];
  dataProps: string[];
  pathwayProps: string[];

  constructor(
    private route: ActivatedRoute,
    private contentManagementService: ContentManagmentService
  ) {
    this.id = '';
    this.pathwayProps = ['label', 'type', 'children'];
    this.dataProps = ['name', 'displayName', 'description', 'uuid'];
  }

  ngOnInit(): void {
    /*TODO: Remove the hardcoded value of the id when the content-management main page ui is implemented.
            The content-management main page should feature a list of curriculum pathways that the user
            can click on and get redirected to a page where the url contains the id of the curriculum_pathway
            this id will be extracted from that url.
      */
    this.id = this.route.snapshot.paramMap.get('id') || '0VPMohg8e7GWDWiIPMp2';
    this.getCurriculumPathway();
  }

  transformPathwayResponse(res: any[]): IPathwayNode[] {
    let newArr: IPathwayNode[] = [];

    for (let i = 0; i < res.length; i++) {
      const newData: IPathwayData = {} as IPathwayData;
      const newNode: IPathwayNode = {} as IPathwayNode;

      for (const prop of this.dataProps) {
        (newData as any)[prop] = res[i].data[prop];
      }

      for (const prop of this.pathwayProps) {
        (newNode as any)[prop] = res[i][prop];
      }

      newNode.data = newData;
      newArr = [...newArr, newNode];
    }
    return newArr;
  }

  getCurriculumPathway(): void {
    this.contentManagementService
      .fetchCurriculumPathway(this.id)
      .subscribe((curriculumPathway: IPathwayNode[]) => {
        this.curriculumPathway =
          this.transformPathwayResponse(curriculumPathway);
      });
  }
}
