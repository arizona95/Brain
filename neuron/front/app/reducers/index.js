import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import storage from 'redux-persist/lib/storage';

import accountReducer from './account';
import commonReducer from './common';
import licenseRootReducer from './license';

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  account: persistReducer({ storage, key: 'auth' }, accountReducer),
  common: commonReducer,
  data: persistReducer(
    { storage, key: 'data', stateReconciler: hardSet },
    licenseRootReducer,
  ),

});

export default rootReducer;
