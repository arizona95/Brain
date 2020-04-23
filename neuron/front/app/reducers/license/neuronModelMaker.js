import {
  MODEL_IMPORT,
  MODEL_IMPORT_FAIL,
  MODEL_IMPORT_SUCCESS,

  MODEL_EXPORT,
  MODEL_EXPORT_FAIL,
  MODEL_EXPORT_SUCCESS,

  MODEL_SAVEAS,
  MODEL_SAVEAS_FAIL,
  MODEL_SAVEAS_SUCCESS,

} from 'actions/neuronModelMaker';




export default (state, action: Action) => {
  switch (action.type) {
    case MODEL_IMPORT :
      return state;
    case MODEL_IMPORT_FAIL :
      return state;
    case MODEL_IMPORT_SUCCESS:
      return {
        ...state,
        graph: action.payload.data.graph,
      };
    case MODEL_EXPORT :
      return state;
    case MODEL_EXPORT_FAIL :
      return state;
    case MODEL_EXPORT_SUCCESS :
      return state;
    case MODEL_SAVEAS :
      return state;
    case MODEL_SAVEAS_FAIL :
      return state;
    case MODEL_SAVEAS_SUCCESS :
      return state;
    default:
      return state;
  }
}
