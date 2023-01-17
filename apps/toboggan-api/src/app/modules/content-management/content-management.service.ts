import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { IPathwayNode } from '@toboggan-ws/toboggan-common';

@Injectable()
export class ContentManagementService {
  constructor(private readonly httpService: HttpService) {}

  getCurriculumPathway(
    uuid: string
  ): Observable<AxiosResponse<IPathwayNode[]>> {
    return this.httpService.get(`/curriculum-pathway/${uuid}?fetch_tree=true`);
  }
}
