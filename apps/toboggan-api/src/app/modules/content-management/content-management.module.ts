import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { environment } from '../../../environments/environment';
import { ContentManagementController } from './content-management.controller';
import { ContentManagementService } from './content-management.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: environment.GPCoreBaseUrl + '/learning-object-service/api/v1',
      timeout: 8000,
      maxRedirects: 3,
    }),
  ],
  controllers: [ContentManagementController],
  providers: [ContentManagementService],
})
export class ContentManagementModule {}
