// @flow
import type { License, LicenseCategory } from 'types';
import type { WorkbookState } from './workbook';

export type LicenseState = {
  loading: boolean,
  byId: {
    [licenseId: number]: License & {
      workbooks: WorkbookState,
    },
  },
  baseCategories: {
    [licenseId: number]: Array<LicenseCategory>
  },
}
