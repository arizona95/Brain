// @flow
import * as commonAction from './common';
import { setPageLoading } from './common';
import { graphFetch, graphAdd, graphDelete, graphExport, graphSaveAs } from './graphInitializeMaker';
import * as graphInitializeMakerAction from './graphInitializeMaker';
import { modelFetch, modelAdd, modelDelete, modelImport, modelExport, modelSaveAs } from './neuronModelMaker' ;
import * as neuronModelMakerAction from './neuronModelMaker';
import { groupFetch, groupAdd, groupDelete, groupImport, groupExport, groupSaveAs} from './neuronGroupMaker'
import * as neuronGroupMakerAction from './neuronGroupMaker';
import { networkFetch, networkAdd, networkDelete, networkImport, networkExport, networkSaveAs} from './neuronNetworkMaker'
import * as neuronNetworkMakerAction from './neuronNetworkMaker';
import { simulatorMaker, simulatorManipulation, simulatorClickInput, simulatorDebugSetting,} from './simulator'
import * as simulatorAction from './simulator';


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
export const graphInitializeMakerActionTypes = getActionTypesAsSet(graphInitializeMakerAction);
export const neuronModelMakerActionTypes = getActionTypesAsSet(neuronModelMakerAction);
export const neuronGroupMakerActionTypes = getActionTypesAsSet(neuronGroupMakerAction);
export const neuronNetworkMakerActionTypes = getActionTypesAsSet(neuronNetworkMakerAction);
export const simulatorActionTypes = getActionTypesAsSet(simulatorAction);

export {
  setPageLoading,

  graphFetch,
  graphAdd,
  graphDelete,
  graphExport,
  graphSaveAs,

  modelFetch,
  modelAdd,
  modelDelete,
  modelImport,
  modelExport,
  modelSaveAs,

  groupFetch,
  groupAdd,
  groupDelete,
  groupImport,
  groupExport,
  groupSaveAs,


  networkFetch,
  networkAdd,
  networkDelete,
  networkImport,
  networkExport,
  networkSaveAs,


  simulatorMaker,
  simulatorManipulation,
  simulatorClickInput,
  simulatorDebugSetting,

}
