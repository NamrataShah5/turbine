import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { enumValidationOptions } from '../common/enumHelpers';
import { UserStatus } from '../users/users.types';

export class CreateAssociationGroupDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description;
}

export class PatchAssociationGroupDto extends PartialType(
  CreateAssociationGroupDto
) {}

export class CreateInstructorDto {
  @IsArray()
  @IsNotEmpty()
  users: [];

  @IsString()
  status: string | null;

  @IsString()
  discipline: string | null;
}

export class PatchInstructorDto extends PartialType(CreateInstructorDto) {}

export class CreateCoachDto {
  @IsArray()
  @IsNotEmpty()
  users: [];

  @IsString()
  status: string | null;
}

export class PatchCoachDto extends PartialType(CreateCoachDto) {}

export class UpdateStatusDTO {
  @IsString()
  @IsNotEmpty()
  @IsEnum(UserStatus, enumValidationOptions('status', UserStatus))
  status: UserStatus;
}

export class CreateLearnerDto {
  @IsArray()
  @IsNotEmpty()
  users: [];

  @IsString()
  status: string | null;
}
