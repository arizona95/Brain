// @flow
import _ from 'lodash';
import type { Action, } from 'types/state';

import{
  graphInitializeListActionTypes,
  graphInitializeMakerActionTypes,
  neuronModelMakerActionTypes,
  neuronModelListActionTypes,
  neuronNetworkMakerActionTypes,
  simulatorActionTypes,

}from 'actions';

const initialState = {
  modelList: {},
  graph: { nodes:[], edges: [] },

  graphList: {},
  networkList:{},
}

import neuronModelMakerReducer from './neuronModelMaker';
import neuronModelListReducer from './neuronModelList';
import graphInitializeListReducer from './graphInitializeList';
import graphInitializeMakerReducer from './graphInitializeMaker';
import neuronNetworkMakerReducer from './neuronNetworkMaker';
import simulatorReducer from './simulator';

export default (state = initialState, action: Action) => {
  if (graphInitializeListActionTypes.has(action.type)) {
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
  else if (neuronModelMakerActionTypes.has(action.type)) {
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
  else if (neuronNetworkMakerActionTypes.has(action.type)) {
    console.log('neuronNetworkMakerActionTypes reducer');

    let cloneState = _.cloneDeep(state);
    const nextState =  neuronNetworkMakerReducer(cloneState, action)

    console.log(nextState)


    return nextState;
  }
  else if (simulatorActionTypes.has(action.type)) {
    console.log('simulatorActionTypes reducer');

    let cloneState = _.cloneDeep(state);
    const nextState =  simulatorReducer(cloneState, action)

    console.log(nextState)


    return nextState;
  }
  else{
    return state;
  }
}
