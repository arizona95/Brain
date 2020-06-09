// @flow
import _ from 'lodash';
import type { Action, } from 'types/state';

import{
  graphInitializeMakerActionTypes,
  neuronModelMakerActionTypes,
  neuronGroupMakerActionTypes,
  neuronNetworkMakerActionTypes,
  simulatorActionTypes,

}from 'actions';

const initialState = {
  graphList: {},
  modelList: {},
  groupList:{},
  networkList:{},

  modelGraph: { nodes:[], edges: [] },
  groupGraph: { nodes:[], edges: [] },
  networkGraph: { nodes:[], edges: [] },

  debugShow: {},
}
import graphInitializeMakerReducer from './graphInitializeMaker';
import neuronModelMakerReducer from './neuronModelMaker';
import neuronGroupMakerReducer from './neuronGroupMaker';
import neuronNetworkMakerReducer from './neuronNetworkMaker';
import simulatorReducer from './simulator';

export default (state = initialState, action: Action) => {
  if (graphInitializeMakerActionTypes.has(action.type)) {
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
  else if (neuronGroupMakerActionTypes.has(action.type)) {
    console.log('neuronGroupMakerActionTypes reducer');

    let cloneState = _.cloneDeep(state);
    const nextState =  neuronGroupMakerReducer(cloneState, action)

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
