import {
  NETWORK_FETCH,
  NETWORK_FETCH_FAIL,
  NETWORK_FETCH_SUCCESS,

} from 'actions/neuronNetworkMaker';


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
    default:
      return state;
  }
}
