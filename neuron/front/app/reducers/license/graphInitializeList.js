import {
  GRAPH_FETCH,
  GRAPH_FETCH_FAIL,
  GRAPH_FETCH_SUCCESS,

  GRAPH_ADD,
  GRAPH_ADD_FAIL,
  GRAPH_ADD_SUCCESS,

  GRAPH_DELETE,
  GRAPH_DELETE_FAIL,
  GRAPH_DELETE_SUCCESS,

} from 'actions/graphInitializeList';

import _ from 'lodash';


export default (state, action: Action) => {
  switch (action.type) {
    case GRAPH_FETCH :
      return state;
    case GRAPH_FETCH_FAIL :
      return state;
    case GRAPH_FETCH_SUCCESS: {
      let nextGraphList = {};
      action.payload.data.map(data => {
        nextGraphList = Object.assign(nextGraphList, { [data.id]: { ...data } })
      })
      return { ...state, graphList: nextGraphList, };
    }
    case GRAPH_ADD :
      return state;
    case GRAPH_ADD_FAIL :
      return state;
    case GRAPH_ADD_SUCCESS:
      return state;
    case GRAPH_DELETE :
      return state;
    case GRAPH_DELETE_FAIL :
      return state;
    case GRAPH_DELETE_SUCCESS :{
      let nextGraphList= _.filter(state.graphList, data => action.context.graphId!= data.id)
      return { ...state, graphList: nextGraphList, };
    }
    default:
      return state;
  }
}
