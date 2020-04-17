import { PAGE_LOADED, PAGE_LOADING } from 'actions/common';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = {
  page: {
    loading: true,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PAGE_LOADING:
    case LOCATION_CHANGE:
      return {
        ...state,
        page: {
          loading: true,
        },
      };
    case PAGE_LOADED:
      return {
        ...state,
        page: {
          loading: false,
        },
      };
    default:
      return state;
  }
}
