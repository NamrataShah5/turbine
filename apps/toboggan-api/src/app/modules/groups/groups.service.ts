import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IGroup } from '@toboggan-ws/toboggan-common';
import * as arrayPaginate from 'array-paginate';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { CreateGroupDTO, PatchGroupDTO } from './groups.dto';

@Injectable()
export class GroupsService {
  groups: IGroup[] = [];
  group: IGroup;

  constructor(private readonly httpService: HttpService) {
    for (let i = 0; i < 20; i++) {
      this.groups.push({
        uuid: uuidv4(),
        name: `Group name ${i}`,
        description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.`,
        members: [],
        permissions: [],
      });
    }
    this.group = this.groups[0];
  }
  // dummy implementation  -> until Quantiphi api is verified
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // getGroups(params?: { skip?: number; limit?: number }) {
  //   return this.groups;
  // }

  getGroups(skip: number, limit: number): Observable<AxiosResponse<IGroup[]>> {
    const params = {
      skip: skip ?? 0,
      limit: limit ?? 1000,
    };
    return this.httpService.get('/groups', { params });
  }

  getGroup(uuid: string): Observable<AxiosResponse<IGroup>> {
    return this.httpService.get(`/group/${uuid}`);
  }

  getPaginatedGroups(currentPage: number, resultsPerPage = 10): IGroup[] {
    const paginatedGroups = arrayPaginate(
      this.groups,
      currentPage,
      resultsPerPage
    );

    return paginatedGroups;
  }

  createGroup(newGroup: CreateGroupDTO): Observable<AxiosResponse<IGroup>> {
    return this.httpService.post('/group', newGroup);
  }

  updateGroup(uuid: string, updatedGroup: Partial<CreateGroupDTO>) {
    return this.httpService.put(`/group/${uuid}`, updatedGroup);
  }

  patchGroup(id: string, updatedGroup: PatchGroupDTO) {
    this.groups = this.groups.map((group) => {
      if (group.uuid === id) {
        return {
          ...group,
          ...updatedGroup,
        };
      }
      return group;
    });
  }

  deleteGroup(uuid: string) {
    return this.httpService.delete(`/group/${uuid}`);
  }

  removeUsersFromGroup(uuid: string, userIds: string[]) {
    return this.httpService.post(`/group/${uuid}/remove-users`, {
      user_ids: userIds,
    });
  }

  addUsersToGroup(uuid: string, userIds: string[]) {
    return this.httpService.post(`/group/${uuid}/add-users`, {
      user_ids: userIds,
    });
  }
}
