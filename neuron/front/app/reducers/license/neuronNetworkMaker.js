import {
  NETWORK_FETCH,
  NETWORK_FETCH_FAIL,
  NETWORK_FETCH_SUCCESS,

  NETWORK_ADD,
  NETWORK_ADD_FAIL,
  NETWORK_ADD_SUCCESS,

  NETWORK_DELETE,
  NETWORK_DELETE_FAIL,
  NETWORK_DELETE_SUCCESS,

  NETWORK_IMPORT,
  NETWORK_IMPORT_FAIL,
  NETWORK_IMPORT_SUCCESS,

  NETWORK_EXPORT,
  NETWORK_EXPORT_FAIL,
  NETWORK_EXPORT_SUCCESS,

  NETWORK_SAVEAS,
  NETWORK_SAVEAS_FAIL,
  NETWORK_SAVEAS_SUCCESS,

} from 'actions/neuronNetworkMaker';
import _ from "lodash";


export default (state, action: Action) => {
  switch (action.type) {
    case NETWORK_FETCH :
      return state;
    case NETWORK_FETCH_FAIL :
      return state;
    case NETWORK_FETCH_SUCCESS:{
      let nextNetworkList = {};
      action.payload.data.map(data => {
        nextNetworkList = Object.assign(nextNetworkList, { [data.id]: { ...data } })
      })
      return { ...state, networkList: nextNetworkList, };
    }
    case NETWORK_ADD :
      return state;
    case NETWORK_ADD_FAIL :
      return state;
    case NETWORK_ADD_SUCCESS:
      return state;
    case NETWORK_DELETE :
      return state;
    case NETWORK_DELETE_FAIL :
      return state;
    case NETWORK_DELETE_SUCCESS :{
      let nextNetworkList= _.filter(state.networkList, data => action.context.networkId!= data.id)
      return { ...state, networkList: nextNetworkList, };
    }
    case NETWORK_IMPORT :
      return state;
    case NETWORK_IMPORT_FAIL :
      return state;
    case NETWORK_IMPORT_SUCCESS:
      return {
        ...state,
        networkGraph: action.payload.data.graph,
      };
    case NETWORK_EXPORT :
      return state;
    case NETWORK_EXPORT_FAIL :
      return state;
    case NETWORK_EXPORT_SUCCESS :
      return state;
    case NETWORK_SAVEAS :
      return state;
    case NETWORK_SAVEAS_FAIL :
      return state;
    case NETWORK_SAVEAS_SUCCESS :
      return state;
    default:
      return state;
  }
}
