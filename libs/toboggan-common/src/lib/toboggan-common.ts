export function tobogganCommon(): string {
  return 'toboggan-common';
}

export interface IGroup {
  name: string;
  description: string | null;
  uuid: string;
  members: string[];
  permissions: string[];
}

export interface IAssessment {
  id: string;
  uuid: string;
  learnerName: string;
  learnerId: string;
  timerStartTime: string;
  result: string | null;
  resultComment: string | null;
  unitName: string;
  type: string;
  attemptNo: number;
  maxAttempts: number,
  instructorName: string;
  comments: any;
  evaluated: boolean;
  flagged: boolean;
  assignedTo: string;
  discipline: string;
  unit: string;
  evaluatedBy: string;
}

export type INewGroup = Omit<IGroup, 'id'>;

export interface IUser {
  userType?: string | null;
  status?: string;
  userId: string;
  userName: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  groups?: IGroup[];
  userGroups?: IGroup[];
}

export type INewUser = Omit<IUser, 'userId'>;

export type IUpdatedUser = Omit<IUser, 'userId' | 'userName'>;

export interface IAddUserToGroup {
  groupId: string;
  email: string;
}

export interface IPermission {
  id: string;
  application: string;
  module: string;
  accessLevel: string;
  userGroups: IGroup[];
}

export type INewPermission = Omit<IPermission, 'id'>;

export enum UserType {
  Learner = 'learner',
  Faculty = 'faculty',
  Other = 'other',
}

// IMPORTANT!! Mock interface - need to update when the endpoint is ready
export interface IStaffProfile {
  uuid: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  preferredPronoun: string;
  bio: string;
  email: string;
  phoneNumber: string;
  inboxes: string;
}

export interface IPathwayNode {
  label: string;
  type: string;
  data: IPathwayData;
  children?: IPathwayNode[];
}

export interface IPathwayData {
  name: string;
  displayName?: string;
  description?: string;
  uuid?: string;
}

export interface ISignedUrlResponse {
  signed_url: string;
  resource_type: string;
}
