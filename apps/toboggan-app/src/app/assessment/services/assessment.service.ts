import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAssessment } from '@toboggan-ws/toboggan-common';
import { firstValueFrom, Subject } from 'rxjs';
import { ISubmittedAssessmentItem } from '../interface/assessments.type';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  constructor(private http: HttpClient) {}
  public myPendingListCount = new Subject<number>();
  public allPendingListCount = new Subject<number>();

  passmyPendingListCount(data: number) {
    this.myPendingListCount.next(data);
  }

  passAllPendingListCount(data: number) {
    this.allPendingListCount.next(data);
  }

  fetchAssessments() {
    return this.http.get<IAssessment[]>('/api/assessments');
  }

  fetchEvaluatedAssessments() {
    return this.http.get<IAssessment[]>('/api/assessments/evaluated');
  }

  fetchEvaluationBacklog() {
    return this.http.get<IAssessment[]>('/api/assessments/evaluation-backlog');
  }

  // update submitted assessment
  async updateSubmittedAssessment(
    uuid: string,
    body: Partial<ISubmittedAssessmentItem>
  ) {
    await firstValueFrom(
      this.http.put('/api/assessments/subittedAssessment/' + uuid, body)
    );
  }
}
