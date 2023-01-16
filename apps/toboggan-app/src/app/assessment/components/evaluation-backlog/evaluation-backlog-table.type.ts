import {
  TableColumnAlignmentEnum,
  TableColumnDataTypeEnum,
  TableColumnDisplayMetadatum,
  TableColumnSortStateEnum
} from '@snhuproduct/toboggan-ui-components-library';

export const evaluationBacklogTableHeader: TableColumnDisplayMetadatum[] = [
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
    dataKey: 'learner',
    parents: '',
    searchableField: true,
    alignment: TableColumnAlignmentEnum.Left,
    sort: TableColumnSortStateEnum.Disabled,
  },
  {
    title: 'Unit',
    dataKey: 'competency',
    parents: '',
    defaultSort: true,
    searchableField: true,
    alignment: TableColumnAlignmentEnum.Left,
    dataType: TableColumnDataTypeEnum.TextNowrap,
  },
  {
    title: 'Type',
    dataKey: 'type',
    parents: '',
    defaultSort: true,
    searchableField: true,
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
    dataKey: 'instructor',
    parents: '',
    defaultSort: true,
    searchableField: true,
    alignment: TableColumnAlignmentEnum.Left,
    dataType: TableColumnDataTypeEnum.TextNowrap,
    
  },
  {
    title: 'Assigned To',
    dataKey: 'assignedTo',
    parents: '',
    defaultSort: true,
    searchableField: true,
    alignment: TableColumnAlignmentEnum.Left,
    dataType: TableColumnDataTypeEnum.TextNowrap,
    sticky: true
  }
];
