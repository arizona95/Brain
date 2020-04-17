// @flow
import _ from 'lodash';
import type { Action, } from 'types/state';

import{
  neuronModelMakerActionTypes,
  neuronModelListActionTypes,
}from 'actions';

const initialState = {
  modelList: {},
  graph: { nodes:[], edges: [] },
}

import neuronModelMakerReducer from './neuronModelMaker';
import neuronModelListReducer from './neuronModelList';

export default (state = initialState, action: Action) => {
  if (neuronModelMakerActionTypes.has(action.type)) {
    console.log('neuronModelMaker reducer');

    let cloneState = _.cloneDeep(state);
    const nextState =  neuronModelMakerReducer(cloneState, action)

    console.log(nextState)


    return nextState;
  }
  else if (neuronModelListActionTypes.has(action.type)) {
    console.log('neuronModelList reducer');

    let cloneState = _.cloneDeep(state);
    const nextState =  neuronModelListReducer(cloneState, action)

    console.log(nextState)


    return nextState;
  }
  else{
    return state;
  }
}
