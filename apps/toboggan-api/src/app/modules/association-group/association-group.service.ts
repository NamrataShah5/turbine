import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  IAssociationGroup,
  ICoach,
  IInstructor,
  ILearner
} from '@toboggan-ws/toboggan-common';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateAssociationGroupDto,
  CreateCoachDto,
  CreateInstructorDto,
  CreateLearnerDto,
  UpdateStatusDTO
} from './association-group.dto';

@Injectable()
export class AssociationGroupService {
  associationGroups: IAssociationGroup[] = [];
  associationGroup: IAssociationGroup;
  instructorList: IInstructor[] = [];
  coachList: ICoach[] = [];
  learnerList: ILearner[] = [];

  constructor(private readonly httpService: HttpService) {
    for (let i = 0; i < 10; i++) {
      this.associationGroups.push({
        uuid: uuidv4(),
        type:  Math.random() < 0.5 ? 'learner' : 'discipline',
        name: `Association Group ${i}`,
        description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. a consequat massa quis enim. Donec.`,
        members: [],
      });

      this.learnerList.push({
        userType: 'learner',
        status: 'active',
        userId: uuidv4(),
        userName: `FirstLast ${i}`,
        firstName: 'First',
        lastName: `Last ${i}`,
        email: 'first@gmail.com',
      });

      this.instructorList.push({
        userType: 'Faculty',
        status: 'active',
        userId: uuidv4(),
        userName: `FirstLast ${i}`,
        firstName: 'First',
        lastName: `Last ${i}`,
        email: 'first@gmail.com',
        Discipline: 'Math',
      });

      this.coachList.push({
        userType: 'Coach',
        status: 'active',
        userId: uuidv4(),
        userName: `FirstLast ${i}`,
        firstName: 'First',
        lastName: `Last ${i}`,
        email: 'first@gmail.com',
      });
    }
    this.associationGroup = this.associationGroups[0];
  }

  getAssociationGroups(): IAssociationGroup[] {
    return this.associationGroups;
  }

  getAssociationGroup(id: string): IAssociationGroup {
    return this.associationGroup;
  }

  createAssociationGroup(
    newGroupDto: CreateAssociationGroupDto
  ): IAssociationGroup {
      const newGroup = {uuid: uuidv4(), members:[], ...newGroupDto};
      this.associationGroups.push(newGroup);
      return newGroup;
  }

  updateAssociationGroup(
    id: string,
    updatedGroup: Partial<CreateAssociationGroupDto>
  ) {
    return this.associationGroup;
  }

  // patchGroup(id: string, updatedGroup: PatchAssociationGroupDto) {
  //   this.associationGroups = this.associationGroups.map((group) => {
  //     if (group.id === id) {
  //       return {
  //         ...group,
  //         ...updatedGroup,
  //       };
  //     }
  //     return group;
  //   });
  // }

  deleteAssociationGroup(id: string) {
    this.associationGroups = this.associationGroups.filter(group => group.uuid !== id)
  }

  getInstructors(id: string): IInstructor[] {
    return this.instructorList;
  }

  getLearners(id: string): ILearner[] {
    return this.learnerList;
  }

  getCoaches(id: string): ICoach[] {
    return this.coachList;
  }

  createLearner(learner: CreateLearnerDto): IInstructor {
    return this.learnerList[0];
  }

  createInstructor(instructor: CreateInstructorDto): IInstructor {
    return this.instructorList[0];
  }

  createCoach(coach: CreateCoachDto): ICoach {
    return this.coachList[0];
  }

  updateInstructor(
    id: string,
    updatedInstructor: Partial<CreateInstructorDto>
  ) {
    return this.instructorList[0];
  }

  updateCoach(id: string, updatedCoach: Partial<CreateCoachDto>) {
    return this.coachList[0];
  }

  deleteInstructor(id: string) {
    return;
  }

  deleteCoach(id: string) {
    return;
  }

  deleteLearner(id: string) {
    return;
  }
  updateStatus(id: string, updateStatus: UpdateStatusDTO) {
    return;
  }
}
