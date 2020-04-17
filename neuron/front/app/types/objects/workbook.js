// @flow
import type { LicenseCategory } from './license';

export type Workbook = {
  id: number,
  name: string,
  categories: Array<LicenseCategory>,
  problems: Object,
  selected: boolean,
  t: number,
};
