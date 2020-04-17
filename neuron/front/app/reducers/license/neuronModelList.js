import {
  MODEL_FETCH,
  MODEL_FETCH_FAIL,
  MODEL_FETCH_SUCCESS,

  MODEL_ADD,
  MODEL_ADD_FAIL,
  MODEL_ADD_SUCCESS,

  MODEL_DELETE,
  MODEL_DELETE_FAIL,
  MODEL_DELETE_SUCCESS,

} from 'actions/neuronModelList';

import _ from 'lodash';


export default (state, action: Action) => {
  switch (action.type) {
    case MODEL_FETCH :
      return state;
    case MODEL_FETCH_FAIL :
      return state;
    case MODEL_FETCH_SUCCESS: {
      let nextModelList = {};
      action.payload.data.map(data => {
        nextModelList = Object.assign(nextModelList, { [data.id]: { ...data } })
      })
      return { ...state, modelList: nextModelList, };
    }
    case MODEL_ADD :
      return state;
    case MODEL_ADD_FAIL :
      return state;
    case MODEL_ADD_SUCCESS:
      return state;
    case MODEL_DELETE :
      return state;
    case MODEL_DELETE_FAIL :
      return state;
    case MODEL_DELETE_SUCCESS :{
      let nextModelList= _.filter(state.modelList, data => action.context.modelId!= data.id)
      return { ...state, modelList: nextModelList, };
    }
    default:
      return state;
  }
}
