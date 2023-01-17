import {
  Controller,
  Get,
  Param, UseGuards,
  UseInterceptors
} from '@nestjs/common';

import { HTTPHeaderAuthGuard } from '../auth/http-header-auth-guard.service';
import { TokenInterceptor } from '../auth/token.interceptor';
import { RequestInterceptor } from '../common/request.interceptor';
import { ResponseInterceptor } from '../common/response.interceptor';
import { ContentManagementService } from './content-management.service';


@UseGuards(HTTPHeaderAuthGuard)
@UseInterceptors(TokenInterceptor, ResponseInterceptor, RequestInterceptor)
@Controller('curriculum-pathway')
export class ContentManagementController {
  constructor(private readonly contentManagementService: ContentManagementService) {}

  @Get('/:uuid')
  getCurriculumPathway(@Param('uuid') uuid) {
    return this.contentManagementService.getCurriculumPathway(uuid);
  }
}
