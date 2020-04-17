// @flow
import type { Workbook } from '../objects';
import type { ProblemState } from './problem';


export type WorkbookState = {
  loading: false,
  byId: {
    [workbookId: number]: Workbook & {
      problems: ProblemState,
    },
  },
  current: ?Workbook,
}
