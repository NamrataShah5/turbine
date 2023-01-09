/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IAssessment {
  uuid: string;
  name: string;
  question: string | null;
  answer: string | null;
  context: string;
  status?: AssessmentStatus;
  options: never[] | null;
  question_type: string | null;
  activity_type: string | null;
  use_type: string | null;
  metadata: IAssessmentAlignments | null;
  author: string | null;
  difficulty: number | null;
  alignments: IAssessmentAlignments | null;
  parent_nodes: IAssessmentParentNodes;
  references: IAssessmentReferences;
  child_nodes: IAssessmentAlignments | null;
  assessment_reference: IAssessmentReference | null;
  achievements: string[];
  created_time: string;
  last_modified_time: string;
  is_flagged: boolean;
  comments: any;
}

export enum AssessmentStatus {
  ReadyToBeScored = 'ready_to_be_scored',
  NotReadyToBeScored = 'not_ready_to_be_scored',
}

export interface IAssessmentAlignments {}

export interface IAssessmentReference {
  activity_id: string;
  activity_template_id: string;
  source: string;
}

export interface IAssessmentParentNodes {
  learning_experiences: string[];
  learning_objects: string[];
}

export interface IAssessmentReferences {
  competencies: any[];
  skills: any[];
}

export interface ISubmittedAssessment {
  assessment_id: string;
  learner_id: string;
  assessor_id: string;
  type: string;
  plagiarism_score: number;
  plagiarism_report_path: string;
  assessment_gcs_path: string;
  result: string;
  pass_status: boolean;
  is_flagged: boolean;
  status: SubmittedAssessmentStatus;
  comments: ISubmittedAssessmentItemComment[];
  attempt_no: number;
  assessment_session_id: string;
  assessment_session_data: object;
  submitted_rubrics: object;
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
