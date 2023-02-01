import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { environment } from '../../../environments/environment';
import { AssociationGroupController } from './association-group.controller';
import { AssociationGroupService } from './association-group.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: environment.GPCoreBaseUrl + '/assessment-service/api/v1',
      timeout: 8000,
      maxRedirects: 3,
    }),
  ],
  controllers: [AssociationGroupController],
  providers: [AssociationGroupService],
})
export class AssociationGroupModule {}
