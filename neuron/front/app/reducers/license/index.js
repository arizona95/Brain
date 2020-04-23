// @flow
import _ from 'lodash';
import type { Action, } from 'types/state';

import{
  neuronModelMakerActionTypes,
  neuronModelListActionTypes,
  graphInitializeListActionTypes,
  graphInitializeMakerActionTypes,
}from 'actions';

const initialState = {
  modelList: {},
  graph: { nodes:[], edges: [] },

  graphList: {},
}

import neuronModelMakerReducer from './neuronModelMaker';
import neuronModelListReducer from './neuronModelList';
import graphInitializeListReducer from './graphInitializeList';
import graphInitializeMakerReducer from './graphInitializeMaker';

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
  else if (graphInitializeListActionTypes.has(action.type)) {
    console.log('raphInitializeList reducer');

    let cloneState = _.cloneDeep(state);
    const nextState =  graphInitializeListReducer(cloneState, action)

    console.log(nextState)


    return nextState;
  }
  else if (graphInitializeMakerActionTypes.has(action.type)) {
    console.log('graphInitializeMaker reducer');

    let cloneState = _.cloneDeep(state);
    const nextState =  graphInitializeMakerReducer(cloneState, action)

    console.log(nextState)


    return nextState;
  }
  else{
    return state;
  }
}
