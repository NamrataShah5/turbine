import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IAssessment } from '@toboggan-ws/toboggan-common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { ISubmittedAssessment } from './assessments.types';

@Injectable()
export class AssessmentsService {
  assessments: IAssessment[] = [];

  constructor(private readonly httpService: HttpService) {
    this.assessments = [];
  }

  getAssessments() {
    return {
      data: {
        data: this.assessments.filter((assessment) => !assessment.evaluated),
        success: true,
      },
    };
  }


  getEvaluatedAssessments() {
    return {
      data: {
        data: this.assessments.filter((assessment) => assessment.evaluated),
        success: true,
      },
    };
  }

  getAssessmentsById(assessor_id:string) {
    return this.httpService.get(`/submitted-assessments?assessor_id=${assessor_id}&status=non_evaluated`) 
  }

  getEvaluationBacklog(): Observable<AxiosResponse<IAssessment[]>> {
    return this.httpService.get(`/submitted-assessments?status=non_evaluated`)
  }

  updateSubmittedAssessment(
    uuid: string,
    body: Partial<ISubmittedAssessment>
  ): Observable<AxiosResponse<IAssessment>> {
    return this.httpService.put(`/submitted-assessment/${uuid}`, body);
  }
}
