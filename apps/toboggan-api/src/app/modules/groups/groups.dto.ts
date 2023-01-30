import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string | null;

  @IsOptional()
  members: string[];

  @IsOptional()
  permissions: string[];
}

export class PatchGroupDTO extends PartialType(CreateGroupDTO) {}

export class AddGroupToUsersDTO {
  // array of strings
  @IsNotEmpty()
  @IsString({ each: true })
  user_ids: string[];
}

export class RemoveGroupToUsersDTO extends AddGroupToUsersDTO {}
