// @flow
import * as commonAction from './common';
import { setPageLoading } from './common';
import { modelImport, modelExport, modelSaveAs } from './neuronModelMaker' ;
import * as neuronModelMakerAction from './neuronModelMaker';
import { modelFetch, modelAdd, modelDelete } from './neuronModelList' ;
import * as neuronModelListAction from './neuronModelList';

export const SUCCESS_SUFFIX = '_SUCCESS';
export const ERROR_SUFFIX = '_FAIL';

export const getActionTypes = (
  action: Object,
  { errorSuffix = ERROR_SUFFIX, successSuffix = SUCCESS_SUFFIX }: Object = {}) => {
  let types;
  if (typeof action.type !== 'undefined') {
    const { type } = action;
    types = [type, `${type}${successSuffix}`, `${type}${errorSuffix}`];
  } else if (typeof action.types !== 'undefined') {
    types = action.types;
  } else {
    throw new Error('Action which matched axios middleware needs to have "type" or "types" key which is not null');
  }
  return types;
};

const getActionTypesAsSet = (action): Set<string> => {
  const actionTypes = new Set();
  for (const key in action) {
    if (!Object.prototype.hasOwnProperty.call(action, key)) {
      continue;
    }
    const member = action[key];
    if (typeof member === 'string') {
      actionTypes.add(member);
    }
  }
  return actionTypes;
};

export const commonActionTypes = getActionTypesAsSet(commonAction);
export const neuronModelMakerActionTypes = getActionTypesAsSet(neuronModelMakerAction);
export const neuronModelListActionTypes = getActionTypesAsSet(neuronModelListAction);

export {
  setPageLoading,

  modelImport,
  modelExport,
  modelSaveAs,

  modelFetch,
  modelAdd,
  modelDelete,

}
