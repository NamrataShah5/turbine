import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { environment } from '../../../environments/environment';
import { ContentServingController } from './controller/content-serving.controller';
import { ContentServingService } from './service/content-serving.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: environment.GPCoreBaseUrl + '/learning-object-service/api/v1',
      timeout: 8000,
      maxRedirects: 3,
    }),
  ],
  controllers: [ContentServingController],
  providers: [ContentServingService],
})
export class ContentServingModule {}
