// @flow
import type { HistoryState } from 'types/state/history';
import type { LicenseState } from './license';
import type { ProblemState } from './problem';
import type { WorkbookState } from './workbook';
import type { ExplanationState } from './explanation';
import type { DebateState } from './debate'


export type Action = {
  +type: string,
  +context: Object,
  +payload: Object,
}

export type {
  LicenseState,
  WorkbookState,
  ProblemState,
  HistoryState,
  ExplanationState,
  DebateState,
};
