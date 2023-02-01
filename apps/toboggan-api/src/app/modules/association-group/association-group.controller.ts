import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateAssociationGroupDto,
  CreateCoachDto,
  CreateInstructorDto,
  UpdateStatusDTO,
} from './association-group.dto';
import { AssociationGroupService } from './association-group.service';

@Controller('association-group')
export class AssociationGroupController {
  constructor(
    private readonly associationGroupService: AssociationGroupService
  ) {}

  @Get('/')
  getAssociationGroups() {
    return this.associationGroupService.getAssociationGroups();
  }

  @Get('/:id')
  getAssociationGroup(@Param('id') id) {
    return this.associationGroupService.getAssociationGroup(id);
  }

  @Post('/')
  createAssociationGroup(@Body() group: CreateAssociationGroupDto) {
    return this.associationGroupService.createAssociationGroup(group);
  }

  @Put('/:id')
  updateAssociationGroup(
    @Param('id') id,
    @Body() updatedGroup: Partial<CreateAssociationGroupDto>
  ) {
    return this.associationGroupService.updateAssociationGroup(
      id,
      updatedGroup
    );
  }

  @Delete('/:id')
  deleteAssociationGroup(@Param('id') id) {
    return this.associationGroupService.deleteAssociationGroup(id);
  }

  @Get('/instructors/:id')
  getInstructors(@Param('id') id) {
    return this.associationGroupService.getInstructors(id);
  }

  @Get('/learner/:id')
  getLearner(@Param('id') id) {
    return this.associationGroupService.getLearners(id);
  }

  @Get('/coaches/:id')
  getCoaches(@Param('id') id) {
    return this.associationGroupService.getCoaches(id);
  }

  @Put('/instructor/:id')
  updateInstructor(
    @Param('id') id,
    @Body() updatedInstructor: Partial<CreateInstructorDto>
  ) {
    return this.associationGroupService.updateInstructor(id, updatedInstructor);
  }

  @Put('/coach/:id')
  updateCoach(@Param('id') id, @Body() updatedCoach: Partial<CreateCoachDto>) {
    return this.associationGroupService.updateCoach(id, updatedCoach);
  }

  @Delete('/instructor/:id')
  deleteInstructor(@Param('id') id) {
    return this.associationGroupService.deleteInstructor(id);
  }

  @Delete('/coach/:id')
  deleteCoach(@Param('id') id) {
    return this.associationGroupService.deleteCoach(id);
  }

  @Delete('/learner/:id')
  deleteLearner(@Param('id') id) {
    return this.associationGroupService.deleteCoach(id);
  }

  @Post('/learner/status/:id')
  async updateLearnerStatus(@Param('id') id, @Body() body: UpdateStatusDTO) {
    return this.associationGroupService.updateStatus(id, {
      status: body.status,
    });
  }

  @Post('/instructor/status/:id')
  async updateInstructorStatus(@Param('id') id, @Body() body: UpdateStatusDTO) {
    return this.associationGroupService.updateStatus(id, {
      status: body.status,
    });
  }

  @Post('/coach/status/:id')
  async updatecoachStatus(@Param('id') id, @Body() body: UpdateStatusDTO) {
    return this.associationGroupService.updateStatus(id, {
      status: body.status,
    });
  }
}
