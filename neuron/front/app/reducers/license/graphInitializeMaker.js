import {
  GRAPH_EXPORT,
  GRAPH_EXPORT_FAIL,
  GRAPH_EXPORT_SUCCESS,

  GRAPH_SAVEAS,
  GRAPH_SAVEAS_FAIL,
  GRAPH_SAVEAS_SUCCESS,

} from 'actions/graphInitializeMaker';




export default (state, action: Action) => {
  switch (action.type) {
    case GRAPH_EXPORT :
      return state;
    case GRAPH_EXPORT_FAIL :
      return state;
    case GRAPH_EXPORT_SUCCESS :
      return state;
    case GRAPH_SAVEAS :
      return state;
    case GRAPH_SAVEAS_FAIL :
      return state;
    case GRAPH_SAVEAS_SUCCESS :
      return state;
    default:
      return state;
  }
}
