/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IAssessmentItem {
  uuid: string;
  name: string;
  question: string | null;
  answer: string | null;
  context: string;
  status?: AssessmentStatus;
  options: never[] | null;
  questionType: string | null;
  activityType: string | null;
  useType: string | null;
  metadata: IAssessmentAlignments | null;
  author: string | null;
  difficulty: number | null;
  alignments: IAssessmentAlignments | null;
  parentNodes: IAssessmentParentNodes;
  references: IAssessmentReferences;
  childNodes: IAssessmentAlignments | null;
  assessmentReference: IAssessmentReference | null;
  achievements: string[];
  createdTime: string;
  lastModifiedTime: string;
  isFlagged: boolean;
  comments: string;
}

export interface ISubmittedAssessmentItem {
  assessmentId: string;
  learnerId: string;
  assessorId: string;
  type: string;
  plagiarismScore: number;
  plagiarismReportPath: string;
  assessmentGcsPath: string;
  result: string;
  passStatus: boolean;
  isFlagged: boolean;
  status: SubmittedAssessmentStatus;
  comments: ISubmittedAssessmentItemComment[];
  attemptNo: number;
  assessmentSessionId: string;
  assessmentSessionData: object;
  submittedRubrics: object;
}

export enum SubmittedAssessmentStatus {
  NonEvaluated = 'non-evaluated',
  Evaluated = 'evaluated',
  Paused = 'paused',
}

export interface ISubmittedAssessmentItemComment {
  comment: string;
  type: SubmittedAssessmentCommentType;
  access: string;
  author: string;
}

export enum SubmittedAssessmentCommentType {
  NonEvaluated = 'non-eval',
  Flagged = 'flag',
}

export enum AssessmentStatus {
  ReadyToBeScored = 'ready_to_be_scored',
  NotReadyToBeScored = 'not_ready_to_be_scored',
}

export interface IAssessmentAlignments {}

export interface IAssessmentReference {
  activityId: string;
  activityTemplateId: string;
  source: string;
}

export interface IAssessmentParentNodes {
  learningExperiences: string[];
  learningObjects: string[];
}

export interface IAssessmentReferences {
  competencies: any[];
  skills: any[];
}

export interface IAssessmentFlag {
  isFlagged: boolean;
  comments: string;
}
