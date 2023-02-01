import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IAssociationGroup,
  ICoach,
  IInstructor,
  ILearner,
} from '@toboggan-ws/toboggan-common';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssociationGroupService {
  private _groupUpdated = new BehaviorSubject<IAssociationGroup>(
    {} as IAssociationGroup
  );
  groupUpdated$ = this._groupUpdated.asObservable();
  constructor(private http: HttpClient) {}

  // Fetch all groups
  fetchAssociationGroups() {
    return this.http.get<IAssociationGroup[]>('/api/association-group');
  }

  fetchAssociationGroupDetails(uuid: string) {
    return this.http.get<IAssociationGroup>('/api/association-group/' + uuid);
  }

  // Creates group
  createAssociationGroup(group: Partial<IAssociationGroup>) {
    return this.http.post('/api/association-group', group);
  }

  // Updates group
  async updateAssociationGroup(
    group: Partial<IAssociationGroup>,
    uuid: string
  ) {
    await firstValueFrom(
      this.http.put('/api/association-group/' + uuid, group)
    );
  }

  //Delete group
  async deleteAssociationGroup(uuid: string) {
    await firstValueFrom(this.http.delete(`/api/association-group/${uuid}`));
  }

  publishGroupCompleted(group: IAssociationGroup) {
    this._groupUpdated.next(group);
  }

  getInstructorsByGroup(uuid: string) {
    return this.http.get<IInstructor[]>(
      '/api/association-group/instructors/' + uuid
    );
  }
  getCoachesByGroup(uuid: string) {
    return this.http.get<ICoach[]>('/api/association-group/coaches/' + uuid);
  }
  getLearnerByGroup(uuid: string) {
    return this.http.get<ICoach[]>('/api/association-group/learner/' + uuid);
  }

  async updateLearnerStatus(
    status: Partial<ILearner>,
    uuid: string
  ): Promise<void> {
    await firstValueFrom(
      this.http.post(`/api/association-group/status/learner/${uuid}`, status)
    );
  }

  async updateCoachStatus(
    status: Partial<ICoach>,
    uuid: string
  ): Promise<void> {
    await firstValueFrom(
      this.http.post(`/api/association-group/status/coach/${uuid}`, status)
    );
  }

  async updateInstructorStatus(
    status: Partial<IInstructor>,
    uuid: string
  ): Promise<void> {
    await firstValueFrom(
      this.http.post(`/api/association-group/instructor/status/${uuid}`, status)
    );
  }
}
