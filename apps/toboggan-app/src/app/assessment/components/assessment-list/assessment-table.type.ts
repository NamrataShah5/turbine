import {
  TableColumnAlignmentEnum,
  TableColumnDataTypeEnum,
  TableColumnDisplayMetadatum,
  TableColumnSortStateEnum
} from '@snhuproduct/toboggan-ui-components-library';

export const assessmentTableHeader: TableColumnDisplayMetadatum[] = [
  {
    title: 'Time left',
    dataKey: 'time_left',
    parents: '',
    defaultSort: true,
    searchableField: true,
    sort: TableColumnSortStateEnum.Descending,
    alignment: TableColumnAlignmentEnum.Left,
    dataType: TableColumnDataTypeEnum.TextNowrap,
  },
  {
    title: 'Learner',
    dataKey: 'learnerName',
    parents: '',
    searchableField: true,
    alignment: TableColumnAlignmentEnum.Left,
    sort: TableColumnSortStateEnum.Disabled,
  },
  {
    title: 'Unit',
    dataKey: 'unitName',
    parents: '',
    defaultSort: true,
    searchableField: true,
    filterable: true,
    alignment: TableColumnAlignmentEnum.Left,
    dataType: TableColumnDataTypeEnum.TextNowrap,
  },
  {
    title: 'Type',
    dataKey: 'type',
    parents: '',
    defaultSort: true,
    searchableField: true,
    filterable: true,
    alignment: TableColumnAlignmentEnum.Left,
    dataType: TableColumnDataTypeEnum.TextNowrap,
  },
  {
    title: 'Attempt',
    dataKey: 'attempt',
    parents: '',
    defaultSort: true,
    searchableField: true,
    alignment: TableColumnAlignmentEnum.Left,
    dataType: TableColumnDataTypeEnum.Attempts,
  },
  {
    title: 'Instructor',
    dataKey: 'instructorName',
    parents: '',
    defaultSort: true,
    searchableField: true,
    alignment: TableColumnAlignmentEnum.Left,
    dataType: TableColumnDataTypeEnum.TextNowrap,
  }
];

export enum RowActions {
  FlagForInstructorReview = 'Flag for instructor review',
  Evaluate = 'Evaluate',
  ReturnUnEvaluated = 'Return unevaluated',
  RemoveFlag = 'Remove flag',
}
