import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AddGroupToUsersDTO,
  CreateGroupDTO,
  PatchGroupDTO,
  RemoveGroupToUsersDTO,
} from './groups.dto';

import { HTTPHeaderAuthGuard } from '../auth/http-header-auth-guard.service';
import { TokenInterceptor } from '../auth/token.interceptor';
import { RequestInterceptor } from '../common/request.interceptor';
import { ResponseInterceptor } from '../common/response.interceptor';
import { GroupsService } from './groups.service';

@UseGuards(HTTPHeaderAuthGuard)
@UseInterceptors(TokenInterceptor, ResponseInterceptor, RequestInterceptor)
@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get('/')
  getGroups(@Query() query) {
    const { skip, limit } = query;
    return this.groupsService.getGroups(skip, limit);
  }

  @Get('/:uuid')
  getGroup(@Param('uuid') uuid) {
    return this.groupsService.getGroup(uuid);
  }

  @Post('/')
  createGroup(@Body() group: CreateGroupDTO) {
    return this.groupsService.createGroup(group);
  }

  @Put('/:uuid')
  updateGroup(
    @Param('uuid') uuid,
    @Body() updatedGroup: Partial<CreateGroupDTO>
  ) {
    return this.groupsService.updateGroup(uuid, updatedGroup);
  }

  @Patch('/:id')
  patchGroup(@Param('id') id, @Body() updatedGroup: PatchGroupDTO) {
    return this.groupsService.patchGroup(id, updatedGroup);
  }

  @Delete('/:uuid')
  deleteGroup(@Param('uuid') uuid) {
    return this.groupsService.deleteGroup(uuid);
  }

  @Post('/:uuid/add-users')
  addUsersToGroup(@Param('uuid') uuid, @Body() body: AddGroupToUsersDTO) {
    return this.groupsService.addUsersToGroup(uuid, body.user_ids);
  }

  @Post('/:uuid/remove-users')
  removeUsersFromGroup(
    @Param('uuid') uuid,
    @Body() body: RemoveGroupToUsersDTO
  ) {
    return this.groupsService.removeUsersFromGroup(uuid, body.user_ids);
  }
}
