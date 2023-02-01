import { Module } from '@nestjs/common';
import { StaffProfileModule } from '../staff-profile/staff-profile.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { AssociationGroupModule } from './modules/association-group/association-group.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { ContentManagementModule } from './modules/content-management/content-management.module';
import { ContentServingModule } from './modules/content-serving/content-serving.module';
import { GroupsModule } from './modules/groups/groups.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    GroupsModule,
    PermissionsModule,
    AssessmentsModule,
    AuthenticationModule,
    StaffProfileModule,
    ContentManagementModule,
    ContentServingModule,
    AssociationGroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
