import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAssessment } from '@toboggan-ws/toboggan-common';
import { firstValueFrom } from 'rxjs';
import { ISubmittedAssessmentItem } from '../interface/assessments.type';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  constructor(private http: HttpClient) {}

  fetchAssessments() {
    return this.http.get<IAssessment[]>('/api/assessments');
  }

  fetchEvaluatedAssessments() {
    return this.http.get<IAssessment[]>('/api/assessments/evaluated');
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
