import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import axios from 'axios';
import { HTTPHeaderAuthGuard } from '../../auth/http-header-auth-guard.service';
import { TokenInterceptor } from '../../auth/token.interceptor';
import { ContentServingService } from '../service/content-serving.service';

@UseGuards(HTTPHeaderAuthGuard)
@UseInterceptors(TokenInterceptor)
@Controller('content-serving')
export class ContentServingController {
  constructor(private contentServingService: ContentServingService) {}

  @Get('/url/:uuid')
  async getSignedUrl(@Param('uuid') uuid: string) {
    const result = await this.contentServingService.getSignedUrl(uuid);
    return result;
  }

  @Get('/data/:uuid')
  async getData(@Param('uuid') uuid: string) {
    const url = await this.contentServingService.getSignedUrl(uuid);
    const res = await axios.get(url.signed_url);
    return res.data;
  }
}
