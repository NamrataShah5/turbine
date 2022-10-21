import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IAddUserToGroup, IGroup } from '@toboggan-ws/toboggan-common';
import * as arrayPaginate from 'array-paginate';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GroupsService {
  groups: IGroup[] = [];
  group: IGroup;

  constructor(private readonly httpService: HttpService) {
    for (let i = 0; i < 20; i++) {
      this.groups.push({
        id: uuidv4(),
        name: `Group name ${i}`,
        description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.`,
      });
    }
    this.group = this.groups[0];
  }
  // dummy implementation  -> until Quantiphi api is verified
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // getGroups(params?: { skip?: number; limit?: number }) {
  //   return this.groups;
  // }

  getGroups(params?: {
    skip?: number;
    limit?: number;
  }): Observable<AxiosResponse<IGroup[]>> {
    return this.httpService.get('/groups', { params });
  }

  getGroup(): IGroup {
    return this.group;
  }

  getPaginatedGroups(currentPage: number, resultsPerPage = 10): IGroup[] {
    const paginatedGroups = arrayPaginate(
      this.groups,
      currentPage,
      resultsPerPage
    );

    return paginatedGroups;
  }

  createGroup(newGroup: IGroup) : Observable<AxiosResponse <IGroup>> {
    return this.httpService.post('/group', newGroup);
  }

  updateGroup(id: string, updatedGroup: IGroup) {
    this.groups = this.groups.map((group) => {
      if (group.id === id) {
        return {
          id: group.id,
          ...updatedGroup,
        };
      }
      return group;
    });
  }

  patchGroup(id: string, updatedGroup: IGroup) {
    this.groups = this.groups.map((group) => {
      if (group.id === id) {
        return {
          ...group,
          ...updatedGroup,
        };
      }
      return group;
    });
  }

  deleteGroup(id: string) {
    this.groups = this.groups.filter((group) => group.id !== id);
  }

  addUsersToGroup(request: IAddUserToGroup) {
    console.log(request);
  }
}
