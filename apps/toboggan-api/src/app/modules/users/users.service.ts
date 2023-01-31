/* eslint-disable no-await-in-loop */
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';

import { IUser, UserType } from '@toboggan-ws/toboggan-common';
import { lastValueFrom, map } from 'rxjs';
import { modelToCamelCase } from '../common/utils';
import { GroupsService } from '../groups/groups.service';
import { UpdateStatusDTO, UpdateUserDTO } from './users.dto';
import { ICreateUser, UserStatus } from './users.types';

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly groupService: GroupsService
  ) {}

  getUsers(skip: number, limit: number, userType?: UserType) {
    const params = {
      skip: skip ?? 0,
      limit: limit ?? 1000,
      userType: userType ?? null,
    };
    return this.httpService.get('/users', { params });
  }

  getUser(id: string) {
    return this.httpService.get(`/user/${id}`);
  }

  searchUser(email: string) {
    return this.httpService.get(`/user/search`, {
      params: {
        email,
      },
    });
  }

  createUser(user: ICreateUser) {
    return this.httpService.post('/user', user);
  }

  updateUser(id: string, user: UpdateUserDTO) {
    return this.httpService.put(`/user/${id}`, user);
  }

  deleteUser(id: string) {
    return this.httpService.delete(`/user/${id}`);
  }

  isUserActive(email: string) {
    return this.searchUser(email).pipe(
      map((response) => {
        const user = response.data.data[0];

        if (user.status === UserStatus.Active) {
          return true;
        }

        return false;
      })
    );
  }

  async updateStatus(id: string, updateStatus: UpdateStatusDTO) {
    const response = await lastValueFrom(this.getUser(id));
    const user = modelToCamelCase(response.data.data) as IUser;
    const status = user.status as UserStatus;

    switch (status) {
      case UserStatus.Inactive: // activate user
        throw new BadRequestException(
          "Sorry, this behavior wasn't implemented yet."
        );
      case UserStatus.Active:
        await this.deactivateUser(user, updateStatus);
        break;
    }

    const updateUser = await lastValueFrom(
      this.httpService.post(`/user/${id}/change-status`, updateStatus)
    );

    return updateUser;
  }

  async deactivateUser(user: IUser, updateStatusDTO: UpdateStatusDTO) {
    const isUserAlreadyInactive = this.isUserAlreadyAtStatus(
      user,
      updateStatusDTO,
      UserStatus.Inactive
    );
    if (isUserAlreadyInactive) {
      throw new BadRequestException('Sorry, this user is already inactive.');
    }

    // given that the user was in a group, when the administrator deactivates their account, then the user's account is removed from that group

    const userGroups = user.userGroups;

    for (const groupUuid of userGroups) {
      await lastValueFrom(
        this.groupService.removeUsersFromGroup(groupUuid, [user.userId])
      );
    }
  }

  private activateUser(user: IUser, updateStatusDTO: UpdateStatusDTO) {
    const isUserAlreadyActive = this.isUserAlreadyAtStatus(
      user,
      updateStatusDTO,
      UserStatus.Active
    );
    if (isUserAlreadyActive) {
      throw new BadRequestException('Sorry, this user is already active.');
    }
  }

  private isUserAlreadyAtStatus(
    user: IUser,
    updateStatusDTO: UpdateStatusDTO,
    status: UserStatus
  ) {
    if (user.status === status && updateStatusDTO.status === status) {
      return true;
    }

    return false;
  }
}
