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
} from '@nestjs/common';
import { CreateGroupDto, PatchGroupDto, IAddUserToGroupDto } from "../../dto/groups.dto";
import { GroupsService } from '../../providers/groups/groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get('/')
  getGroups(@Query() query) {
    const { currentPage, resultsPerPage } = query;

    if (currentPage && resultsPerPage) {
      return this.groupsService.getPaginatedGroups(currentPage, resultsPerPage);
    }

    return this.groupsService.getGroups();
  }

  @Get('/:id')
  getGroup() {
    return this.groupsService.getGroup();
  }

  @Post('/')
  createGroup(@Body() group: CreateGroupDto) {
    return this.groupsService.createGroup(group);
  }

  @Put('/:id')
  updateGroup(@Param('id') id, @Body() updatedGroup: CreateGroupDto) {
    return this.groupsService.updateGroup(id, updatedGroup);
  }

  @Patch('/:id')
  patchGroup(@Param('id') id, @Body() updatedGroup: PatchGroupDto) {
    return this.groupsService.patchGroup(id, updatedGroup);
  }

  @Delete('/:id')
  deleteGroup(@Param('id') id) {
    return this.groupsService.deleteGroup(id);
  }

  // TODO: Refactor this route to follow REST principles
  @Post('/addusertogroup')
  addUsersToGroup(@Body() request: IAddUserToGroupDto) {
    return this.groupsService.addUsersToGroup(request);
  }

  //Remove user from a group
  @Delete('/:id/user/:userid')
  removeUserFromGroup(@Param('id') groupId, @Param('userId') userId) {
    console.log(groupId, userId);
  }
}
