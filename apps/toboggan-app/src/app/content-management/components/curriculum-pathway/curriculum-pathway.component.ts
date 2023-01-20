import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { IPathwayNode } from '@toboggan-ws/toboggan-common';
import { ContentSelectionService } from '../../services/content-selection.service';

@Component({
  selector: 'toboggan-ws-curriculum-pathway',
  templateUrl: './curriculum-pathway.component.html',
  styleUrls: ['./curriculum-pathway.component.scss'],

})
export class CurriculumPathwayComponent {
  @Input() curriculumPathway!: IPathwayNode[];
  selectedNode: string;
  treeControl = new NestedTreeControl<IPathwayNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<IPathwayNode>();

  constructor(private contentSelectionService: ContentSelectionService) {
    this.selectedNode = '';
    this.dataSource.data = this.curriculumPathway || [];
  }

  addNode(type: string, uuid: string) {
    this.selectedNode = uuid;
    this.contentSelectionService.selectContent(type === 'learning_resources' ? uuid : undefined);
  }

  hasChild = (_: number, node: IPathwayNode) => !!node.children && node.children.length > 0;
}
