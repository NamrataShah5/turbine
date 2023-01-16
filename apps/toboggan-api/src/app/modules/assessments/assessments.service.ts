import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IAssessment } from '@toboggan-ws/toboggan-common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ISubmittedAssessment } from './assessments.types';

function addHoursAndMinutes(numOfHours, numOfMinutes = 0, date = new Date()) {
  date.setHours(date.getHours() + numOfHours);
  date.setMinutes(date.getMinutes() + numOfMinutes);

  return date.toISOString();
}

@Injectable()
export class AssessmentsService {
  assessments: IAssessment[] = [];

  constructor(private readonly httpService: HttpService) {
    this.assessments = [
      {
        id: '1',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(10, 30),
        learner: 'Jessica',
        learnerId: uuidv4(),
        result: null,
        resultComment: null,
        competency: 'Analyze Written Works',
        type: 'Final',
        currentAttempt: 1,
        attempts: 3,
        instructor: 'Christopher Edwards',
        evaluated: false,
        flagged: true,
        comments: null,
        assignedTo: 'Dawn Hall',
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson'
      },
      {
        id: '2',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(-4, -18),
        learner: 'James',
        learnerId: uuidv4(),
        result: null,
        resultComment: null,
        competency: "Explain Writer's Choices",
        type: 'Practice 1',
        currentAttempt: 1,
        attempts: 1,
        instructor: 'Julia De La Cruz',
        evaluated: false,
        flagged: false,
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson',
        comments: [
          {
            comment: 'adfsdgsgd',
            type: 'non-eval',
            access: 'string',
            author: 'string',
          },
        ],
        assignedTo: 'Christopher Edwards'
      },
      {
        id: '3',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(-5, -45),
        learner: 'Karl',
        learnerId: uuidv4(),
        result: null,
        resultComment: null,
        competency: 'Adapt the Writing Process',
        type: 'Practice 2',
        currentAttempt: 1,
        attempts: 1,
        instructor: 'Dawn Hall',
        evaluated: false,
        flagged: false,
        comments: null,
        assignedTo: 'Christopher Edwards',
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson'
      },
      {
        id: '4',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(-10, -30),
        learner: 'Sebastian',
        learnerId: uuidv4(),
        result: null,
        resultComment: null,
        competency: 'Analyze Written Works',
        type: 'Final',
        currentAttempt: 4,
        attempts: 3,
        instructor: 'Christopher Edwards',
        evaluated: false,
        flagged: false,
        comments: null,
        assignedTo: 'Dawn Hall',
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson'
      },
      {
        id: '5',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(-14, -30),
        learner: 'Bruno',
        learnerId: uuidv4(),
        result: null,
        resultComment: null,
        competency: "Explain Writer's Choices",
        type: 'Practice 1',
        currentAttempt: 1,
        attempts: 1,
        instructor: 'Julia De La Cruz',
        evaluated: false,
        flagged: false,
        comments: null,
        assignedTo: 'Christopher Edwards',
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson'
      },
      {
        id: '6',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(-14, -30),
        learner: 'Ronald',
        learnerId: uuidv4(),
        result: null,
        resultComment: null,
        competency: 'Adapt the Writing Process',
        type: 'Practice 2',
        currentAttempt: 1,
        attempts: 1,
        instructor: 'Dawn Hall',
        evaluated: false,
        flagged: false,
        comments: null,
        assignedTo: 'Christopher Edwards',
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson'
      },
      {
        id: '7',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(-28, -30),
        learner: 'Lori',
        learnerId: uuidv4(),
        result: 'Non-Eval',
        resultComment:
          'Bear claw tootsie roll pudding pudding sesame snaps brownie powder cupcake. Pie candy macaroon shortbread sweet sugar plum. Bear claw marzipan sweet cheesecake gummies chupa chups.',
        competency: 'Analyze Written Works',
        type: 'Final',
        currentAttempt: 3,
        attempts: 3,
        instructor: 'Christopher Edwards',
        evaluated: true,
        flagged: false,
        comments: null,
        assignedTo: 'Dawn Hall',
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson'
      },
      {
        id: '8',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(-28, -30),
        learner: 'Emily',
        learnerId: uuidv4(),
        result: 'Not Evident',
        resultComment: null,
        competency: "Explain Writer's Choices",
        type: 'Practice 1',
        currentAttempt: 1,
        attempts: 1,
        instructor: 'Julia De La Cruz',
        evaluated: true,
        flagged: false,
        comments: null,
        assignedTo: 'Christopher Edwards',
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson'
      },
      {
        id: '9',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(-28, -30),
        learner: 'Katleen',
        learnerId: uuidv4(),
        result: 'Proficient',
        resultComment: null,
        competency: 'Adapt the Writing Process',
        type: 'Practice 2',
        currentAttempt: 1,
        attempts: 1,
        instructor: 'Dawn Hall',
        evaluated: true,
        flagged: false,
        comments: null,
        assignedTo: 'Christopher Edwards',
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson'
      },
      {
        id: '10',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(-28, -30),
        learner: 'Andrew',
        learnerId: uuidv4(),
        result: 'Exemplary',
        resultComment: null,
        competency: 'Analyze Written Works',
        type: 'Final',
        currentAttempt: 1,
        attempts: 3,
        instructor: 'Christopher Edwards',
        evaluated: true,
        flagged: false,
        comments: null,
        assignedTo: 'Dawn Hall',
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson'
      },
      {
        id: '11',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(-28, -30),
        learner: 'James',
        learnerId: uuidv4(),
        result: 'Exemplary',
        resultComment: null,
        competency: "Explain Writer's Choices",
        type: 'Practice 1',
        currentAttempt: 1,
        attempts: 1,
        instructor: 'Julia De La Cruz',
        evaluated: true,
        flagged: false,
        comments: null,
        assignedTo: 'Christopher Edwards',
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson'
      },
      {
        id: '12',
        uuid: uuidv4(),
        timeLeft: addHoursAndMinutes(-28, -30),
        learner: 'Karl',
        learnerId: uuidv4(),
        result: 'Proficient',
        resultComment: null,
        competency: 'Adapt the Writing Process',
        type: 'Practice 2',
        currentAttempt: 1,
        attempts: 1,
        instructor: 'Dawn Hall',
        evaluated: true,
        flagged: false,
        comments: null,
        assignedTo: 'Christopher Edwards',
        discipline: 'IDS',
        unit: 'Analyze Written Works',
        evaluatedBy: 'James Robertson'
      },
    ];
  }

  getAssessments() {
    return {
      data: {
        data: this.assessments.filter((assessment) => !assessment.evaluated),
        success: true,
      },
    };
  }

  getEvaluationBacklogAssessments() {
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

  updateSubmittedAssessment(
    uuid: string,
    body: Partial<ISubmittedAssessment>
  ): Observable<AxiosResponse<IAssessment>> {
    return this.httpService.put(`/submitted-assessment/${uuid}`, body);
  }
}
