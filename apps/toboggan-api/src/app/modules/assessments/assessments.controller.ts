import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { HTTPHeaderAuthGuard } from '../auth/http-header-auth-guard.service';
import { TokenInterceptor } from '../auth/token.interceptor';
import { RequestInterceptor } from '../common/request.interceptor';
import { ResponseInterceptor } from '../common/response.interceptor';
import { AssessmentsService } from './assessments.service';
import { ISubmittedAssessment } from './assessments.types';

@UseGuards(HTTPHeaderAuthGuard)
@UseInterceptors(TokenInterceptor, ResponseInterceptor, RequestInterceptor)
@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  // get assessment by assessor_id : we are passing logged in user id as assessor id
  @Get('/mypending/:uuid')
  getAssessmentsById(@Param('uuid') uuid,) {
    return this.assessmentsService.getAssessmentsById(uuid);
  }


  @Get('/evaluated')
  getEvaluatedAssessments() {
    return this.assessmentsService.getEvaluatedAssessments();
  }

  @Get('/evaluation-backlog')
  getEvaluationBacklog() {
    return this.assessmentsService.getEvaluationBacklog();
  }

  // update submitted assessment
  @Put('/subittedAssessment/:uuid')
  updateSubmittedAssessment(
    @Param('uuid') uuid,
    @Body() body: Partial<ISubmittedAssessment>
  ) {
    return this.assessmentsService.updateSubmittedAssessment(uuid, body);
  }
}
