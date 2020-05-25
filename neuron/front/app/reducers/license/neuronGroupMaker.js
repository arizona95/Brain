import {
  GROUP_FETCH,
  GROUP_FETCH_FAIL,
  GROUP_FETCH_SUCCESS,

  GROUP_ADD,
  GROUP_ADD_FAIL,
  GROUP_ADD_SUCCESS,

  GROUP_DELETE,
  GROUP_DELETE_FAIL,
  GROUP_DELETE_SUCCESS,

  GROUP_IMPORT,
  GROUP_IMPORT_FAIL,
  GROUP_IMPORT_SUCCESS,

  GROUP_EXPORT,
  GROUP_EXPORT_FAIL,
  GROUP_EXPORT_SUCCESS,

  GROUP_SAVEAS,
  GROUP_SAVEAS_FAIL,
  GROUP_SAVEAS_SUCCESS,

} from 'actions/neuronGroupMaker';
import _ from "lodash";


export default (state, action: Action) => {
  switch (action.type) {
    case GROUP_FETCH :
      return state;
    case GROUP_FETCH_FAIL :
      return state;
    case GROUP_FETCH_SUCCESS:{
      let nextGroupList = {};
      action.payload.data.map(data => {
        nextGroupList = Object.assign(nextGroupList, { [data.id]: { ...data } })
      })
      return { ...state, groupList: nextGroupList, };
    }
    case GROUP_ADD :
      return state;
    case GROUP_ADD_FAIL :
      return state;
    case GROUP_ADD_SUCCESS:
      return state;
    case GROUP_DELETE :
      return state;
    case GROUP_DELETE_FAIL :
      return state;
    case GROUP_DELETE_SUCCESS :{
      let nextGroupList= _.filter(state.groupList, data => action.context.groupId!= data.id)
      return { ...state, groupList: nextGroupList, };
    }
    case GROUP_IMPORT :
      return state;
    case GROUP_IMPORT_FAIL :
      return state;
    case GROUP_IMPORT_SUCCESS:
      return {
        ...state,
        groupGraph: action.payload.data.graph,
      };
    case GROUP_EXPORT :
      return state;
    case GROUP_EXPORT_FAIL :
      return state;
    case GROUP_EXPORT_SUCCESS :
      return state;
    case GROUP_SAVEAS :
      return state;
    case GROUP_SAVEAS_FAIL :
      return state;
    case GROUP_SAVEAS_SUCCESS :
      return state;
    default:
      return state;
  }
}
