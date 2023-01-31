/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from '@toboggan-ws/toboggan-common';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GroupsService } from '../groups/groups.service';
import { UsersService } from './users.service';
import { UserStatus } from './users.types';

describe('GroupsService', () => {
  let module: TestingModule;
  let usersService: UsersService;
  let httpService: HttpService;
  const data = {
    data: {},
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          baseURL: environment.GPCoreBaseUrl + '/authentication/api/v1',
          timeout: 8000,
          maxRedirects: 3,
        }),
      ],
      providers: [UsersService, GroupsService],
    }).compile();
  });

  beforeEach(async () => {
    usersService = module.get<UsersService>(UsersService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('checkPagination', () => {
    it('should work with given pagination', (done) => {
      // @ts-ignore
      jest.spyOn(httpService, 'get').mockImplementation(() => of(data));
      expect(
        usersService.getUsers(1, 10).subscribe((response) => {
          expect(httpService.get).toBeCalledWith('/users', {
            params: { limit: 10, skip: 1, userType: null },
          });
          expect(response).toEqual(data);
          done();
        })
      );
    });

    it('should work with default pagination', (done) => {
      // @ts-ignore
      jest.spyOn(httpService, 'get').mockImplementation(() => of(data));
      expect(
        usersService.getUsers(undefined, undefined).subscribe((response) => {
          expect(httpService.get).toBeCalledWith('/users', {
            params: { limit: 1000, skip: 0, userType: null },
          });
          expect(response).toEqual(data);
          done();
        })
      );
    });

    describe('User - Deactivate', () => {
      it('should remove the user from their groups', async () => {
        const user = {
          userId: 'user-id-123',
          userGroups: ['group-id-1', 'group-id-2'],
          status: 'active',
        } as IUser;
        const updateStatusDTO = { status: 'inactive' as UserStatus };

        const spyRemoveUsersFromGroup = jest.spyOn(
          // @ts-ignore
          usersService.groupService,
          'removeUsersFromGroup'
        );

        httpService.post = jest.fn().mockImplementation(() => of(data));

        await usersService.deactivateUser(user, updateStatusDTO);

        expect(spyRemoveUsersFromGroup).toHaveBeenCalledWith('group-id-1', [
          'user-id-123',
        ]);
      });

      it('should not remove the user from their groups if the user is already inactive', async () => {
        const user = {
          userId: 'user-id-123',
          userGroups: ['group-id-1', 'group-id-2'],
          status: 'inactive',
        } as IUser;
        const updateStatusDTO = { status: 'inactive' as UserStatus };

        await expect(
          usersService.deactivateUser(user, updateStatusDTO)
        ).rejects.toThrow('Sorry, this user is already inactive');
      });
    });
  });
});
