// @flow

export type License = {
  id: number,
  name: string,
  categories: Array<LicenseCategory>,
  workbooks: Object,
  persist: ?boolean,
};

export type LicenseCategory = {
  id: number,
  name: string,
  checked: ?boolean,
};
