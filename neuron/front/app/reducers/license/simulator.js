import {
  NETWORK_FETCH,
  NETWORK_FETCH_FAIL,
  NETWORK_FETCH_SUCCESS,

  SIMULATOR_MAKE,
  SIMULATOR_MAKE_FAIL,
  SIMULATOR_MAKE_SUCCESS,

  SIMULATOR_MANIPULATION,
  SIMULATOR_MANIPULATION_FAIL,
  SIMULATOR_MANIPULATION_SUCCESS,

  SIMULATOR_CLICK,
  SIMULATOR_CLICK_FAIL,
  SIMULATOR_CLICK_SUCCESS,

  SIMULATOR_DEBUG,
  SIMULATOR_DEBUG_FAIL,
  SIMULATOR_DEBUG_SUCCESS,

} from 'actions/simulator';




export default (state, action: Action) => {
  switch (action.type) {
    case NETWORK_FETCH :
      return state;
    case NETWORK_FETCH_FAIL :
      return state;
    case NETWORK_FETCH_SUCCESS:
      return state;
    case SIMULATOR_MAKE :
      return state;
    case SIMULATOR_MAKE_FAIL :
      return state;
    case SIMULATOR_MAKE_SUCCESS:
      return state;
    case SIMULATOR_MANIPULATION :
      return state;
    case SIMULATOR_MANIPULATION_FAIL :
      return state;
    case SIMULATOR_MANIPULATION_SUCCESS:
      return state;
    case SIMULATOR_CLICK :
      return state;
    case SIMULATOR_CLICK_FAIL :
      return state;
    case SIMULATOR_CLICK_SUCCESS:
      return state;
    case SIMULATOR_DEBUG :
      return state;
    case SIMULATOR_DEBUG_FAIL :
      return state;
    case SIMULATOR_DEBUG_SUCCESS: {
      return {
        ...state,
        debugShow : action.payload.data,
      };
    }
    default:
      return state;
  }
}
